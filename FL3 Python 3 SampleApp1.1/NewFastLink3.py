'''
Copyright 2018 Yodlee, Inc. All Rights Reserved.
This software is the confidential and proprietary information of
Yodlee, Inc. Use is subject to license terms.
 '''
import urllib.request
import json
import webbrowser
import os

'''
 FastLink lets users add accounts held at their financial institutions.
 Users can add their accounts by searching a financial institution’s site and entering the login credentials for that particular site.
 This console based app demonstrate how to access fastlink. Below are the 3 API's required to authenticate and access fastlink from yodlee API's.
 1)CobrandLogin:Uses the /cobrand login API authenticates a cobrand
 2)UserLogin:Uses /user API allows a registered user to login into the application
 3)AccessToken: User /user/accessToken API  to get accessToken required to authenticate the fastlink.
 Simple HTML request is used to post the request for the fastlink to get it invoked.

'''

API_URL="https://developer.api.yodlee.com/ysl/"
NODE_URL="https://node.developer.yodlee.com/authenticate/restserver/"
COBRAND_NAME="restserver"
API_VERSION="1.1"
dataSet=""

messages={"cob_login":[input("Enter cobrand login id: "),input("Enter cobrand password: ")],
          "user_login":[input("Enter user login id: "),input("Enter user password: ")]}

#COBRAND login default values.
COB_LOGIN_ID = ""
COB_LOGIN_PASSWORD = ""

#USER login default values.
USER_ID = ""
USER_PASSWORD= ""

#URLS
COB_LOGIN_URL = "cobrand/login"
USER_LOGIN_URL = "user/login"
TOKEN_URL="user/accessTokens"

#FINAPP_ID
FINAPP_ID = "10003600"

#HEADERS.
REQUEST_HEADERS={'Content-type': 'application/json'}

Html="""<div class='center processText'>Processing...</div>
    <div>
    <form action='{NODE_URL}' method='post' id='rsessionPost'>
        RSession : <input type='text' name='rsession' placeholder='rsession' value='{RSESSION}' id='rsession'/><br/>
        FinappId : <input type='text' name='app' placeholder='FinappId' value='{FINAPP_ID}' id='finappId'/><br/>
        Redirect : <input type='text' name='redirectReq' placeholder='true/false' value='true'/><br/>
        Token : <input type='text' name='token' placeholder='token' value='{TOKEN}' id='token'/><br/>
        Extra Params : <input type='text' name='extraParams' placeholer='Extra Params' value='{EXTRA_PARAMS}' id='extraParams'/><br/>
        </form></div>
        <script>document.getElementById('rsessionPost').submit();</script>"""


def read_data(data_key):
        console_messages=messages.get(data_key)
        results=[]
        for message in console_messages:
            results.append(message)
        return results

def parse_response(res_str):
    res_str=res_str.decode()
    return json.loads(res_str)


def get_cobrandlogin_request_params(coblogin_id,cobpassword):
    return { "cobrand": {"cobrandLogin": coblogin_id,"cobrandPassword": cobpassword,"locale": "en_US"}}


def get_userlogin_req_params(userid,password):
    return {"user": { "loginName": userid, "password": password,"locale": "en_US" }}

def get_token_req_params(cobsession,usersession,finapp_id):
    return {"cobSessionToken":cobsession,"rsession":usersession,"finAppId":finapp_id}

def dispaly_error(json_obj):
    if not json_obj:
        print (" No response ::: ", json_obj)
    else:
        print (" Error response:::: ",json_obj)
    

class fl_sampleapp(object):
    
    def __init__(self,header,base_url,finapp_id):
        self.headers=header
        self.url=base_url
        self.finapp_id=finapp_id
    
    def call_service(self,request_url,request_params):
        #data=urllib.parse.urlencode(request_params)
        #new code
        print(" url is::; ", self.url + request_url)
        data = None
        if request_params is not None :
            data = json.dumps(request_params)
            print (" data is::: ",data)
            data = data.encode('utf-8')
        req=urllib.request.Request(self.url+request_url,data,self.headers)
        res=None
        try:
            res=urllib.request.urlopen(req)
        except urllib.error.URLError as urlerror:
            print (urlerror.reason)
            self.req_status='failed'
        except urllib.error.HTTPError as httperror:
            print (httperror.code)
            print (httperror.read())
            self.req_status='failed'
        return res
        
        # To call cobrand login API and to fetch cobsessionToken
    def cobrand_login(self,request_url,cob_uname,cob_pwd):
        request_params = get_cobrandlogin_request_params(cob_uname,cob_pwd)
        self.headers = {'Cobrand-Name': COBRAND_NAME,'Api-Version': API_VERSION,'Content-type': 'application/json'}
        res=self.call_service(request_url, request_params)
        if res:
            cob_login_res=res.read()
            print (" cobrand login response::: ",cob_login_res)
            parsed_response=parse_response(cob_login_res)
            if parsed_response and not parsed_response.get("Error"):
                self.cobsessiontoken=parsed_response.get("session").get("cobSession")
            else:
                dispaly_error(parsed_response)

         # To call user login API and to fetch userSessionToken
    def user_login(self,request_url,user_id,user_pwd):
        request_params=get_userlogin_req_params(user_id,user_pwd)
        self.headers = {'Authorization':'cobSession='+self.cobsessiontoken,'Content-type': 'application/json','Cobrand-Name': COBRAND_NAME,'Api-Version': API_VERSION}
        res=self.call_service(request_url, request_params)
        if res:
            user_login_res=res.read()
            print (" user login response is:: ",user_login_res)
            parsed_response=parse_response(user_login_res)
            if parsed_response and not parsed_response.get("Error"):
                self.usersessiontoken=parsed_response.get("user").get("session").get("userSession")
            else:
                dispaly_error(parsed_response)

    # To call Get Access Token API and to fetch token.
    def get_token(self,request_url):
        self.headers = {'Authorization': 'cobSession=' + self.cobsessiontoken+',userSession='+self.usersessiontoken, 'Content-type': 'application/json','Cobrand-Name': COBRAND_NAME,'Api-Version': API_VERSION}
        res=self.call_service(request_url+'?appIds='+self.finapp_id, None)
        if res:
            token_res=res.read()
            print (" token response is : ",token_res)
            parsed_response = parse_response(token_res)
            auth_info=parsed_response.get("user")
            if auth_info:
                self.token=parsed_response["user"]["accessTokens"][0]["value"]

    
if __name__ == "__main__":
    
    app_obj=fl_sampleapp(REQUEST_HEADERS,API_URL,FINAPP_ID)
    #Read cobrand username and password from user.
    cob_login_credentials = read_data('cob_login')
    app_obj.cobrand_login(COB_LOGIN_URL,cob_login_credentials[0] if cob_login_credentials[0] else COB_LOGIN_ID, 
                          cob_login_credentials[1] if cob_login_credentials[1] else COB_LOGIN_PASSWORD)
    
    if hasattr(app_obj, "cobsessiontoken"):
        user_login_credentials = read_data('user_login')
        app_obj.user_login(USER_LOGIN_URL,user_login_credentials[0] if user_login_credentials[0] else USER_ID,
                           user_login_credentials[1] if user_login_credentials[1] else USER_PASSWORD)
    
    if hasattr(app_obj, "usersessiontoken"):
        app_obj.get_token(TOKEN_URL)
    
    if hasattr(app_obj,"token"):
        args={"NODE_URL":NODE_URL,"RSESSION":app_obj.usersessiontoken,"FINAPP_ID":app_obj.finapp_id,
              "TOKEN":app_obj.token,"EXTRA_PARAMS":dataSet}
        html_content=Html.format(**args)
        fobj = open("post.html","wb")
        fobj.write(html_content.encode('utf-8'))
        fobj.close()
        abs_file_path=os.path.abspath(fobj.name)
        print("Please us this url : "+"file://"+abs_file_path)
        webbrowser.WindowsDefault().open("file://"+abs_file_path)
        
    


        
        
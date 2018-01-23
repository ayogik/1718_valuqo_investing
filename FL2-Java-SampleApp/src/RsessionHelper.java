/*
 *   Copyright 2014 Yodlee, Inc. All Rights Reserved.
 *
 *   This software is the confidential and proprietary information of
 *   Yodlee, Inc. Use is subject to license terms.
 *
 */

import java.awt.Desktop;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLEncoder;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLSession;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.RequestEntity;
import org.apache.commons.httpclient.methods.StringRequestEntity;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.JSONArray;
import org.json.JSONObject;

public class RsessionHelper {

	private String restUrl;
	private String finappId;

	private static String COB_LOGIN_URL = "cobrand/login";
	private static String USER_LOGIN_URL = "user/login";
	private static String GET_TOKEN = "user/accessTokens";
	private static String AUTHENTICATE = "authenticator/authenticate";
	

	
	private String formHtmlContent = "<div class='center processText'>Processing...</div>" 
	+ "<div>"
	+ "<form action='${NODE_URL}' method='post' id='rsessionPost'>"
	+ "	RSession : <input type='text' name='rsession' placeholder='rsession' value='${RSESSION}' id='rsession'/><br/>"
	+ "	FinappId : <input type='text' name='app' placeholder='FinappId' value='${FINAPP_ID}' id='finappId'/><br/>"
	+ "	Redirect : <input type='text' name='redirectReq' placeholder='true/false' value='true'/><br/>"
	+ "	Token : <input type='text' name='token' placeholder='token' value='${TOKEN}' id='token'/><br/>"	
	+ "	Extra Params : <input type='text' name='extraParams' placeholer='Extra Params' value='${EXTRA_PARAMS}' id='extraParams'/><br/>"
	+ "</form></div><script>document.getElementById('rsessionPost').submit();</script>";

	
	public Token loginCobrand(String cobrandLoginValue,
			String cobrandPasswordValue) {

		DefaultHttpClient httpclient = new DefaultHttpClient();
		String url = this.restUrl + COB_LOGIN_URL;
		// User & Cobrand login can be done via normal rest or SOAP.
		System.out.println("Validating Cobrand by Connecting to URL " + url);
		String cobrandSessionToken = null;
		Token token = new Token();
		try {
			PostMethod pm = new PostMethod(url);
			
			final String requestBody="{"+
					"\"cobrand\":      {"+
					"\"cobrandLogin\": "+"\""+cobrandLoginValue+"\""+"," +
					"\"cobrandPassword\": "+"\""+ cobrandPasswordValue +"\""+"," +
					"\"locale\": \"en_US\""+
					"}"+
					"}";
			
			StringRequestEntity requestEntity = new StringRequestEntity(
					requestBody,
				    "application/json",
				    "UTF-8");
		    pm.setRequestEntity(requestEntity);
			
			
			HttpClient hc = new HttpClient();
			// int RC = hc.executeMethod(pm);
			int rc = hc.executeMethod(pm);
			System.out.println("Response Status Code:" + rc);
			String source = pm.getResponseBodyAsString();
			System.out.println(source);
			JSONObject jsonObject = new JSONObject(source);
			if( jsonObject.has("Error") ) {
				ErrorInfo errorInfo = new ErrorInfo("Cobrand Login Failed", (String) jsonObject.get("errorMessage"));
				token.setErrorInfo(errorInfo);
			} else {
				JSONObject cobConvCreds = jsonObject
						.getJSONObject("session");
				cobrandSessionToken = (String) cobConvCreds.get("cobSession");
				token.setCobrandSessionToken(cobrandSessionToken);
				System.out.println("Cobrand Session :" + cobrandSessionToken.length());
			}
		} catch (Exception e) {
			e.printStackTrace();
			ErrorInfo errorInfo = new ErrorInfo("Cobrand Login Failed", (String) e.getMessage());
			token.setErrorInfo(errorInfo);			
		} finally {
			httpclient.getConnectionManager().shutdown();
		}

		return token;
	}

	public Token loginUser(String cobrandSessionToken, String usernameValue,
			String passwordValue) {
		String userSessionToken = null;
		DefaultHttpClient httpclient = new DefaultHttpClient();

		String url = this.restUrl + USER_LOGIN_URL;
		System.out.println("Validating User session by Connecting to URL " + url);		
		Token token = new Token();
		token.setCobrandSessionToken(cobrandSessionToken);
		try {
			PostMethod pm = new PostMethod(url);

						
			 String requestBody="{"+"\"user\":{"+
						"\"loginName\": " +"\""+usernameValue+"\""+","+
						"\"password\": "+"\""+passwordValue+"\""+","+
						"\"locale\": \"en_US\""+
						"}"+
						"}";

			StringRequestEntity requestEntity = new StringRequestEntity(
					requestBody,
				    "application/json",
				    "UTF-8");
			pm.addRequestHeader("Authorization", "cobSession="+cobrandSessionToken);
		    pm.setRequestEntity(requestEntity);
			
			

			HttpClient hc = new HttpClient();
			int rc = hc.executeMethod(pm);
			System.out.println("Response Status Code:" + rc);
			String source = pm.getResponseBodyAsString();
			
			 String indented = (new JSONObject(source)).toString(4);
		        System.out.println(indented);
		       
			JSONObject jsonObject = new JSONObject(source);
			if( jsonObject.has("errorCode") ) {
				ErrorInfo errorInfo = new ErrorInfo("User Login Failed", (String) jsonObject.get("errorMessage"));
				token.setErrorInfo(errorInfo);
			} else {
				JSONObject userContext = jsonObject.getJSONObject("user");
				JSONObject userConvCreds = userContext
						.getJSONObject("session");
				userSessionToken = (String) userConvCreds.get("userSession");
				token.setUserSessionToken(userSessionToken);
				System.out.println("User Session Token : "+userSessionToken.length());
			}

		} catch (Exception e) {
			ErrorInfo errorInfo = new ErrorInfo("User Login Failed", e.getMessage());
			token.setErrorInfo(errorInfo);
			e.printStackTrace();
		} finally {
			httpclient.getConnectionManager().shutdown();
		}
		return token;
	}

	public Token getToken(String cobrandSessionToken, String userSessionToken) {
		String response = null;
		DefaultHttpClient httpclient = new DefaultHttpClient();
		String url = this.restUrl + GET_TOKEN+"?appIds="+finappId;
		System.out.println("Generating Token by Connecting to URL " + url);
		
		Token token = new Token();
		token.setCobrandSessionToken(cobrandSessionToken);
		token.setUserSessionToken(userSessionToken);
		try {
			GetMethod pm = new GetMethod(url);
			
			pm.addRequestHeader("Authorization", "cobSession="+cobrandSessionToken+",userSession="+userSessionToken);
		

			HttpClient hc = new HttpClient();
			int RC = hc.executeMethod(pm);
			System.out.println("Response Status Code : " + RC);
			String source = pm.getResponseBodyAsString();
			 String indented = (new JSONObject(source)).toString(4);
		        System.out.println(indented);
			response = pm.getResponseBodyAsString();
			JSONObject jsonObject = new JSONObject(response);
			if( jsonObject.has("Error") ) {
				ErrorInfo errorInfo = new ErrorInfo("Token Generation Failed", (String) jsonObject.getJSONObject("Error").get("errorDetail"));
				token.setErrorInfo(errorInfo);
			} else {
				
				
				JSONObject userToken = jsonObject.getJSONObject("user");
				JSONArray accessToken = userToken
						.getJSONArray("accessTokens");
				String finappToken = (String) accessToken.getJSONObject(0).getString("value");
				System.out.println("token is : "+ finappToken + "length" +finappToken.length());
				
				
				
				
				token.setToken(finappToken);
			}
		} catch (Exception e) {
			ErrorInfo errorInfo = new ErrorInfo("Token Generation Failed", e.getMessage());
			token.setErrorInfo(errorInfo);
			e.printStackTrace();
		} finally {
			httpclient.getConnectionManager().shutdown();
		}
		return token;
	}
	
	public static void main(String[] args) {
		
		String restUrl = "https://developer.api.yodlee.com/ysl/restserver/v1/";
		String nodeUrl = "https://node.developer.yodlee.com/authenticate/restserver/";
		
		String cobrandLoginValue = "sbCobnoormohammad23";// Put actual cobrand login name
		String cobrandPasswordValue = "886c57b6-5dcf-4e74-bac7-0ee65dfb9fda";// put actual cobrand passwrod

		String userName = "sbMemnoormohammad231"; // Put actual user name
		String password = "sbMemnoormohammad231#123"; // Put actual password


		String finappId = "10003600";//10003620 for IAV
		String extraParams = "";

		RsessionHelper rsh = new RsessionHelper(restUrl, finappId);

		Token token = rsh.loginCobrand(cobrandLoginValue, cobrandPasswordValue);		
		if( token.getCobrandSessionToken() != null ) {
			token = rsh.loginUser(token.getCobrandSessionToken(),
			userName, password);
			if( token.getUserSessionToken() != null ) {
				token = rsh.getToken(token.getCobrandSessionToken(), token.getUserSessionToken());
			}
		}
		if( token.getErrorInfo() != null ) {
			System.err.println(token.getErrorInfo().getDescription());
			System.err.println(token.getErrorInfo().getMessage());
		} else if( token.getToken() != null) {
			try {
				String data = rsh.formHtmlContent.replace("${NODE_URL}", nodeUrl).replace("${RSESSION}", token.getUserSessionToken())
					.replace("${TOKEN}", token.getToken()).replace("${EXTRA_PARAMS}", extraParams).replace("${FINAPP_ID}", finappId);
				File file = new File("post.html");
				if( !file.exists() ) {
					file.createNewFile();
				}
				FileWriter writer = new FileWriter(file);
				writer.write(data);
				writer.close();
			
				String url = "file://"+file.getAbsolutePath().replace("\\", "/");
				//chrome browser
				
				System.out.println("\nPlease use this url:" + url);
				//Runtime.getRuntime().exec(new String[]{"cmd", "/c","start chrome "+url});
				//firefox browser
				Runtime.getRuntime().exec(new String[]{"cmd", "/c","start firefox "+url});
				
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
}

	public RsessionHelper(String restUrl, String finappId) {
		this.restUrl = restUrl;
		this.finappId = finappId;
	}
}


class Token {

	private String cobrandSessionToken;
	
	private String userSessionToken;
	
	private String token;
	
	private ErrorInfo errorInfo;

	public ErrorInfo getErrorInfo() {
		return errorInfo;
	}

	public void setErrorInfo(ErrorInfo errorInfo) {
		this.errorInfo = errorInfo;
	}

	public String getCobrandSessionToken() {
		return cobrandSessionToken;
	}

	public void setCobrandSessionToken(String cobrandSessionToken) {
		this.cobrandSessionToken = cobrandSessionToken;
	}

	public String getUserSessionToken() {
		return userSessionToken;
	}

	public void setUserSessionToken(String userSessionToken) {
		this.userSessionToken = userSessionToken;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}
}

class ErrorInfo {

	private String message;
		
	private String description;

	public ErrorInfo(String message, String description) {
		this.message = message;
		this.description = description;
	}

	public String getMessage() {
		return message;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public void setMessage(String message) {
		this.message = message;
	}

}

/*
 * Copyright (c) 2018 Yodlee, Inc. All Rights Reserved.
 */

import java.io.IOException;
import java.net.URISyntaxException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.ResourceBundle;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import parser.GSONParser;
import util.HTTP;
import beans.AccessToken;
import beans.AccountsArray;
import beans.CobrandContext;
import beans.UserContext;

/**
 * YodleeSampleApp is a HTTPServlet that demonstrates a simple sample finapp which allows the user
 * to login and link financial accounts and see a list of added accounts, account details and transactions.
 * To link an account we demonstrate the use of Yodlee Fastlink application that simplifies the process 
 * into an iFrame/rSession post workflow.
 * 
 * Below are the list of API's demonstrated by YodleeSamleAPP.
 * 1)CobrandLogin- Uses the /cobrand login API authenticates a cobrand
 * 2)UserLogin - Uses /user API allows a registered user to login into the application
 * 3)GetAccounts -This method uses the /accounts API to retieve existing accounts
 * 4)GetTransactions - This method uses /transactions API to get a list of transactions for a user.
 * 5)GetFastLinkToken - This method uses /user/accessToken to get accessToken used in the Fastlink call in an iFrame
 * 6)DeletAccount -This method uses /accounts API to delete an account.
 */  
@WebServlet("/YodleeSampleApp")
public class YodleeSampleApp extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	/**
	 * To load the values from config.properties file required to authenticate and run the yodleSampleAPP.
	 */
	static ResourceBundle resourceBundle = ResourceBundle.getBundle("config");
	public static final String  APIURL= resourceBundle.getString("yodlee.APIURL");
	static String coBrandUserName = resourceBundle.getString("yodlee.coBrandUserName");
	static String coBrandPassword = resourceBundle.getString("yodlee.coBrandPassword");
	static String nodeUrl=resourceBundle.getString("yodlee.nodeUrl");
	static String cobrandName=resourceBundle.getString("yodlee.cobrandName");
	static String apiVersion=resourceBundle.getString("yodlee.apiVersion");
       
    
    public YodleeSampleApp() {
        super();
    }
    

	/**
	 *  doGet() handles the 'GET' request sent from the client side ( Ajax call).
	 *  YodleeSampleApp (client) is using ajax  to make call to the API's. 
	 * @param request  : Request sent from client side.
	 * @param response : response to the client.
	 * 
	 */
    
     
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		
		String cobSession = null;
		String userSession = null;
		
		
		String action = (String)request.getParameter("action");
		
		try {
			cobSession = (String)request.getSession().getAttribute("cobSession");
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		if(action!=null) {
			
			// Initialize the Sample App by starting with cobrand/login Yodlee API call.'
			
			if(action.equals("init")) {
				
				if(cobSession == null)
					cobSession = getCobrandSession();

				if(cobSession != null && cobSession.length() > 0) {
					request.getSession().setAttribute("cobSession", cobSession);
					sendAjaxResponse(response, "{'cobSession':'"+cobSession+"'}");
				}else {
					sendAjaxResponse(response, "{'error':'true', 'message':'Cobrand Configuration Check Failed. Please check settings in config.properties'}");
				}
				
			}else {
				//for all below functional calls userSession is needed.
				
				userSession = (String)request.getSession().getAttribute("userSession");
				
				if(userSession != null && userSession.length() > 0) {
					
					//Get list of users accounts. Uses GET /accounts API
					if(action.equals("getAccounts")) {
						
						String accountsJson = getUserAccounts(cobSession, userSession);
						sendAjaxResponse(response, accountsJson);
					}
					
					// Get list of user transactions for specific account.Uses GET /transactions API
					if(action.equals("getTransactions")) {
						String accountId = (String)request.getParameter("accountId");
						String transactionsJson = getTranactions(cobSession, userSession, accountId);
						sendAjaxResponse(response, transactionsJson);
					}
					
					//Deactivates users specific account. Uses DELETE /accounts/<account id> API
					if(action.equals("deleteAccount")) {
						String accountId = (String)request.getParameter("accountId");
						String deleteAccountResponse = deleteAccount(cobSession, userSession, accountId);
						sendAjaxResponse(response, deleteAccountResponse);
					}
					
					//Obtain security token needed to launch FastLink.
					if(action.equals("getFastLinkToken")) {
						String fastLinkToken = getFastLinkToken(cobSession, userSession);
						System.out.println("Node url is : "+ nodeUrl);
						//String allDataSet="dataset=%5B%7B%22name%22%3A%22ACCT_PROFILE%22%2C%22attribute%22%3A%5B%7B%22name%22%3A%22FULL_ACCT_NUMBER%22%2C%22container%22%3A%5B%22bank%22%5D%7D%2C%7B%22name%22%3A%22HOLDER_NAME%22%2C%22container%22%3A%5B%22bank%22%5D%7D%5D%7D%2C%7B%22name%22%3A%22BASIC_AGG_DATA%22%2C%22attribute%22%3A%5B%7B%22name%22%3A%22ACCOUNT_DETAILS%22%2C%22container%22%3A%5B%22investment%22%2C%22bank%22%5D%7D%2C%7B%22name%22%3A%22HOLDINGS%22%2C%22container%22%3A%5B%22investment%22%2C%22insurance%22%5D%7D%2C%7B%22name%22%3A%22TRANSACTIONS%22%2C%22container%22%3A%5B%22investment%22%2C%22bank%22%5D%7D%5D%7D%5D";
						String allDataSet="";
						//System.out.println("All dataSet is: " + allDataSet);
						String tokens = "{\"userSession\":\""+userSession+"\",\"fastlinkToken\":\""+fastLinkToken+"\",\"nodeUrl\":\""+nodeUrl+"\",\"dataset\":\""+allDataSet+"\"}";
						sendAjaxResponse(response, tokens);
					}
					
					if(action.equals("logout")) {
						//no functionality from servlet. Redirect to login page.
					}
					
					// to get node url
					
					
					
				}else {
					sendAjaxResponse(response, "{'error':'true', 'message':'User session is not valid, please login again.'}");

				}
			}
			
			
		}else {
			sendAjaxResponse(response, "{'error':'true', 'message':'Missing Action parameter'}");
		}
		
	}
	
	/**
	 * sendAjaxResponse()  will format the returning response to client  with contentType and character encoding.
	 * @param response
	 * @param responseString
	 * @throws IOException
	 */

	private void sendAjaxResponse(HttpServletResponse response,
			String responseString) throws IOException {
		
		response.setContentType("text/plain");  
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(responseString);  
		
	}

	/**
	 * To Handle POST request from login screen form (index.html)
	 * @param request  : Request sent from client side.
	 * @param response : response to the client.
	 * 
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		String userSession = null;
		
		String userName = (String) request.getParameter("username");
		String password = (String) request.getParameter("password");
		
		String cobSession = (String) request.getSession().getAttribute("cobSession");
		
		try {
			//Yodlee User Login Call (/user/login)
			userSession = userLogin(cobSession, userName, password);
			request.getSession().setAttribute("userSession", userSession);
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		if(userSession != null) {
			
			sendAjaxResponse(response, "{'error':'false', 'message':'User authentication successfull'}");

			
		}else {
			response.setContentType("text/plain");  
			response.setCharacterEncoding("UTF-8");
			response.getWriter().write("{'error':'true', 'message':'Error in user Login, Invalid user credentials.'}"); 
		}
		
	}
	
	/**
	 * Helper method which performs /cobrand/login API call with Yodlee API server.
	 * @return  cobrandSessionToken  which is required to authenticate and access  yodlee API's
	 */
	
	private String getCobrandSession() {

		String cobSession = "";

		try {
			
			//Request Body - refer to full API reference at https://developer.yodlee.com/apidocs/index.php
			
			 final String requestBody = "{" 
							+ "\"cobrand\":{"
							+ "\"cobrandLogin\":\"" + coBrandUserName + "\""+ "," 
							+ "\"cobrandPassword\": " + "\"" + coBrandPassword + "\"" + "," 
							+ "\"locale\": \"en_US\"" 
							+ "}" 
						  + "}";

			String coBrandLoginURL = APIURL + "cobrand/login";
			String cobrandjsonResponse = HTTP.doPost(coBrandLoginURL,
					requestBody);
			CobrandContext coBrand = (CobrandContext) GSONParser.handleJson(
					cobrandjsonResponse, beans.CobrandContext.class);

			
			if (!cobrandjsonResponse.contains("errorCode")) {
				cobSession = coBrand.getSession().getCobSession();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return cobSession;
	}
	
	/**
	 * Helper method to call user login Yodlee API - /user/login
	 * 
	 * @param cobSession
	 *   UserLogin API expect cobsessionToken for authorization header.
	 * @param userName
	 * @param password
	 * @return userSessionToken which is required for authorization for yodlee API's
	 * @throws URISyntaxException
	 * @throws InterruptedException
	 */
	
	private String userLogin(String cobSession, String userName, String password) throws URISyntaxException, InterruptedException {

		String userSession = null;

		try {
			Map<String, String> loginTokens = new HashMap<String, String>();
			loginTokens.put("cobSession", cobSession);

			// User login
			String userLoginURL = APIURL + "user/login";

			//Request Body JSON - refer to full API reference at https://developer.yodlee.com/apidocs/index.php
			final String requestBody2 = "{" 
								+ "\"user\":{"
								+ "\"loginName\":\"" + userName + "\"" + ","
								+ "\"password\":\"" + password + "\"" + ","
								+ "\"locale\": \"en_US\"" 
								+ "}" 
							+ "}";
			
 
			String userjsonResponse = HTTP.doPostUser(userLoginURL,
					loginTokens, requestBody2, true);
			UserContext member = (UserContext) GSONParser.handleJson(
					userjsonResponse, beans.UserContext.class);
			


			if (!userjsonResponse.contains("errorCode")) {
				userSession = member.getUser().getSession().getUserSession();
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		return userSession;
	}
	
	/**
	 * Helper method to load user accounts from Yodlee APIs
	 * API url : GET /accounts call
	 * Refer to full API references - https://developer.yodlee.com/apidocs/index.php
	 * * 
	 * @param cobSession -required for first layer of authentication to access yodlee API's.
	 * @param userSession -required for second layer of authentication to access yodlee API's.
	 * @return getAccounts API Json response in string format
	 */
	
	private String getUserAccounts(String cobSession, String userSession) {
		String accountURL = APIURL + "accounts";
		Map<String,String> loginTokens = new HashMap<String,String>();
		loginTokens.put("cobSession", cobSession);
		loginTokens.put("userSession",userSession);
		
		String accountJsonResponse=null;
		
		try {
			accountJsonResponse = HTTP.doGet(accountURL,loginTokens);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return accountJsonResponse;
	}
	
	/**
	 * Helper method to get transactions for specific account (id)
	 * API url : GET /transactions
	 * Refer to full API references - https://developer.yodlee.com/apidocs/index.php
	 * * 
	 * @param cobSession- required for first layer of authentication to access yodlee API's.
	 * @param userSession -required for second layer of authentication to access yodlee API's.
	 * @param accountId
	 * AccountId of the user added account which is returned from getAccounts API.
	 * @return transaction API response in string format.
	 */
	
	private String getTranactions(String cobSession, String userSession,
			String accountId) {
		
		String txnJson ="";
		
		DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		Calendar cal = Calendar.getInstance();
		cal.add(Calendar.DATE, -30);
		Date todate1 = cal.getTime();    
        String date = dateFormat.format(todate1);
		System.out.println("Date = "+ date);
		
		String TransactionUrl = APIURL + "transactions" + "?fromDate="+date+"+&accountId="+accountId;

		try {
			Map<String,String> loginTokens = new HashMap<String,String>();
			loginTokens.put("cobSession", cobSession);
			loginTokens.put("userSession",userSession);
			
			txnJson = HTTP.doGet(TransactionUrl,loginTokens);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return txnJson;
	}
	
	/**
	 * Helper method to delete(unlink) specific user account
	 * API url : DELETE /accounts/<accountId>
	 * Refer to full API references - https://developer.yodlee.com/apidocs/index.php
	 * @param cobSession -required for first layer of authentication to access yodlee API's.
	 * @param userSession -required for second layer of authentication to access yodlee API's.
	 * @param accountId
	 * AccountId of the user added account which is returned from getAccounts API.
	 * @return success message for the account being deleted.
	 */
	
	private String deleteAccount(String cobSession, String userSession,
			String accountId) {
		String deleteAccountResponse = null;
		
		String deleteAccountURL = APIURL + "accounts/";
		try {
			
			Map<String,String> loginTokens = new HashMap<String,String>();
			loginTokens.put("cobSession", cobSession);
			loginTokens.put("userSession",userSession);
			
			HTTP.doDelete(deleteAccountURL+accountId, loginTokens);
			
			deleteAccountResponse = "success";
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return deleteAccountResponse;
	}
	
	/**
	 * Helper method to obtain FastLink launch token from Yodlee APIs
	 * GET /user/accessTokens
	 * Refer to full API references - https://developer.yodlee.com/apidocs/index.php
	 * @param cobSession :-required for first layer of authentication to access yodlee API's.
	 * @param userSession :-required for second layer of authentication to access yodlee API's.
	 * @return Fastlink accessToken which is used to invoke fastlink from client side(inside iframe).
	 */
	
	private String getFastLinkToken(String cobSession, String userSession) {

		String fastLinkToken = null;
		String accesstokenJsonResponse = null;
		String accessTokenURL= APIURL + "user/accessTokens?appIds=10003600";
	    	
		try {
			Map<String,String> loginTokens = new HashMap<String,String>();
			loginTokens.put("cobSession", cobSession);
			loginTokens.put("userSession",userSession);
			
			accesstokenJsonResponse = HTTP.doGet(accessTokenURL,loginTokens);
		
			AccessToken userAccess = (AccessToken) GSONParser.handleJson(accesstokenJsonResponse, beans.AccessToken.class);
			fastLinkToken=userAccess.getUser().getAccessTokens()[0].getValue();
		
		} catch (Exception e) {
			e.printStackTrace();
		}
		return fastLinkToken;

	}

}

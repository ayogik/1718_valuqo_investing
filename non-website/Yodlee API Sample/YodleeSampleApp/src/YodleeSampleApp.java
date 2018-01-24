/*
 * Copyright (c) 2017 Yodlee, Inc. All Rights Reserved.
 */

import java.io.IOException;
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
 * Servlet implementation class YodleeSampleApp
 */
@WebServlet("/YodleeSampleApp")
public class YodleeSampleApp extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	
	static ResourceBundle resourceBundle = ResourceBundle.getBundle("config");
	public static final String  localURLVer1= resourceBundle.getString("yodlee.APIURL");
	static String coBrandUserName = resourceBundle.getString("yodlee.coBrandUserName");
	static String coBrandPassword = resourceBundle.getString("yodlee.coBrandPassword");
	static String nodeUrl=resourceBundle.getString("yodlee.nodeUrl");
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public YodleeSampleApp() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
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
			
			// Initialize the Sample App by starting with cobrand/login Yodlee API call.
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
						String tokens = "{\"userSession\":\""+userSession+"\",\"fastlinkToken\":\""+fastLinkToken+"\",\"nodeUrl\":\""+nodeUrl+"\"}";
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

	private void sendAjaxResponse(HttpServletResponse response,
			String responseString) throws IOException {
		
		response.setContentType("text/plain");  
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(responseString);  
		
	}

	/**
	 * Handle POST request from login screen form (index.html)
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
	 * 
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

			String coBrandLoginURL = localURLVer1 + "v1/cobrand/login";
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
	 */
	private String userLogin(String cobSession, String userName, String password) {

		String userSession = null;

		try {
			Map<String, String> loginTokens = new HashMap<String, String>();
			loginTokens.put("cobSession", cobSession);

			// User login
			String userLoginURL = localURLVer1 + "v1/user/login";

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
	 * GET /accounts call
	 * Refer to full API references - https://developer.yodlee.com/apidocs/index.php
	 */
	private String getUserAccounts(String cobSession, String userSession) {
		String accountURL = localURLVer1 + "v1/accounts";
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
	 * GET /transactions
	 * Refer to full API references - https://developer.yodlee.com/apidocs/index.php
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
		
		String TransactionUrl = localURLVer1 + "v1/transactions" + "?fromDate="+date+"+&accountId="+accountId;

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
	 * DELETE /accounts/<accountId>
	 * Refer to full API references - https://developer.yodlee.com/apidocs/index.php
	 */
	private String deleteAccount(String cobSession, String userSession,
			String accountId) {
		String deleteAccountResponse = null;
		
		String deleteAccountURL = localURLVer1 + "v1/accounts/";
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
	 */
	private String getFastLinkToken(String cobSession, String userSession) {

		String fastLinkToken = null;
		String accesstokenJsonResponse = null;
		String accessTokenURL= localURLVer1 + "v1/user/accessTokens?appIds=10003600";
	    	
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

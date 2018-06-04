/*
 * Copyright (c) 2018 Yodlee, Inc. All Rights Reserved.
 */


package util;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.Map;
import java.util.ResourceBundle;


import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;



/**
 * 
 * HTTP class handles multiple  HTTP requests .These include:
 * 'POST'
 * 'GET'
 * 'PUT' 
 * 'DELETE'
 */

public class HTTP 
{       
	private static final String FQCN = HTTP.class.getName();
	private static final String USERAGENT = "Mozilla/5.0";
	private static final String CONTENTTYPEURLENCODED="application/x-www-form-urlencoded";
	private static final String CONTENTTYPEJSON="application/json";
	// Authorization headers
	private static final String[] HEADERS={"Content-Type","Cobrand-Name","Api-Version"};
	/**
	 * To load the values from config.properties file
	 */
	static ResourceBundle resourceBundle = ResourceBundle.getBundle("config");
	static String cobrandName=resourceBundle.getString("yodlee.cobrandName");
	static String apiVersion=resourceBundle.getString("yodlee.apiVersion");
	
	/**performs submission of data to be processed to a specified resource.
	 * doPost() method is used to call cobrandLogin,AddAccount API etc which are POST method API's.
	 * 
	 * @param url : API url.
	 * @param requestBody to post the data to the API.
	 * @return   JsonObject in string format.
	 * @throws IOException
	 * @throws URISyntaxException
	 * @throws InterruptedException
	 */
	
	public static String doPost(String url,String requestBody) throws IOException, URISyntaxException, InterruptedException {
		String mn = "doIO(POST : " + url + ", " + requestBody+" )";
		System.out.println(FQCN + " :: " + mn);
		URL restURL = new URL(url);
		
		HttpURLConnection conn = (HttpURLConnection) restURL.openConnection();
		conn.setRequestMethod("POST");
		conn.setRequestProperty("User-Agent", USERAGENT);
		conn.setRequestProperty("Content-Type", CONTENTTYPEJSON);
		conn.setRequestProperty("Cobrand-Name",cobrandName);
		conn.setRequestProperty("Api-Version",apiVersion);
		conn.setDoOutput(true);
		
		DataOutputStream wr = new DataOutputStream(conn.getOutputStream());
		try{
		wr.writeBytes(requestBody);
		int responseCode = conn.getResponseCode();
		for(String header:HEADERS){
			if(conn.getRequestProperty(header)!=null)
			System.out.println(header+ " : " +conn.getRequestProperty(header));
			}
		System.out.println("Response code is :" + conn.getResponseCode());
		if (conn.getResponseCode()>210) {
			BufferedReader in= new BufferedReader(
					new InputStreamReader(conn.getErrorStream()));

			String inputLine;
			StringBuilder jsonResponse = new StringBuilder();
			while ((inputLine = in.readLine()) != null) {
				jsonResponse.append(inputLine);
			}
			in.close();
			System.out.println("Received error is " +jsonResponse);

		}
	
		
			BufferedReader in = new BufferedReader(
					new InputStreamReader(conn.getInputStream()));

			String inputLine;
			StringBuilder jsonResponse = new StringBuilder();
			while ((inputLine = in.readLine()) != null) {
				jsonResponse.append(inputLine);
			}
			in.close();
			String json=toPrettyFormat(jsonResponse.toString());
			System.out.println(json);
			
			return new String(jsonResponse);
			
			
		}catch (IOException ex){
			System.out.println(ex.getMessage());
		
		}
		
		finally {
	        try {
	            if (conn != null) {
	                 conn.disconnect();
	            }
	            if (wr != null) {
	            	wr.flush();
	            	wr.close();
	            }
	        } catch (IOException ex) {
	        	System.out.println(ex.getMessage());
	        }
	    }
		
		return null;
	}
	
	/**performs submission of data to be processed to a specified resource.
	 * doPostUser() method is used to call userLogin API.
	 * 
	 * @param url :API URL
	 * @param sessionTokens -cobrandSession is required to authenticate and access yodlee API's.
	 * @param requestBody to post the data to the API.
	 * @param isEncodingNeeded  : specialized format is required or not.
	 * @return JsonObject in string format.
	 * @throws IOException
	 * @throws URISyntaxException
	 * @throws InterruptedException
	 */
	
	
	public static String doPostUser(String url, Map<String,String> sessionTokens, String requestBody,boolean isEncodingNeeded) throws IOException, URISyntaxException, InterruptedException {
		String mn="doIO(POST : " + url + ", " + requestBody ;
		System.out.println(FQCN + " :: " + mn);
		URL restURL = new URL(url);
		
		
		HttpURLConnection conn = (HttpURLConnection) restURL.openConnection();
		conn.setRequestMethod("POST");
		conn.setRequestProperty("User-Agent", USERAGENT);
		if(isEncodingNeeded)
			//conn.setRequestProperty("Content-Type", CONTENTTYPEURLENCODED);
			conn.setRequestProperty("Content-Type", CONTENTTYPEJSON);
		else
			conn.setRequestProperty("Content-Type", "text/plain;charset=UTF-8");
			conn.setRequestProperty("Authorization", sessionTokens.toString());
		   conn.setRequestProperty("Cobrand-Name",cobrandName);
		    conn.setRequestProperty("Api-Version",apiVersion);
			conn.setDoOutput(true);
			DataOutputStream wr = new DataOutputStream(conn.getOutputStream());
			try{
			wr.writeBytes(requestBody);
			System.out.println("---Request Header---");
			System.out.println("Authorization : "+ sessionTokens.toString());
			for(String header:HEADERS){
				if(conn.getRequestProperty(header)!=null)
			System.out.println(header+ " : " +conn.getRequestProperty(header));
			}
			
		System.out.println("Response code is :" + conn.getResponseCode());
		if (conn.getResponseCode()>210) {
			BufferedReader in= new BufferedReader(
					new InputStreamReader(conn.getErrorStream()));

			String inputLine;
			StringBuilder jsonResponse = new StringBuilder();
			while ((inputLine = in.readLine()) != null) {
				jsonResponse.append(inputLine);
			}
			in.close();
			System.out.println("Received error is " +jsonResponse);

		}
		
		
			BufferedReader in = new BufferedReader(
					new InputStreamReader(conn.getInputStream()));

			String inputLine;
			StringBuilder jsonResponse = new StringBuilder();
			while ((inputLine = in.readLine()) != null) {
				jsonResponse.append(inputLine);
			}
			in.close();
			String json=toPrettyFormat(jsonResponse.toString());
			System.out.println(json);

			return new String(jsonResponse);
		}catch (IOException ex){
			System.out.println(ex.getMessage());
					}
		
		finally {
	        try {
	            if (conn != null) {
	            	 conn.disconnect();
	            }
	            if (wr != null) {
	            	wr.flush();
	            	wr.close();
	            }
	        } catch (IOException ex) {
	        	System.out.println(ex.getMessage());
	        }
	    }
		
		
		return null;
	}
	
	/** Requests data from a specified resource
	 * doGet() method is used to call getAccounts,getTransactions,getHoldings API. 
	 * @param url : API URL.
	 * @param sessionTokens :cobrandSession and userSession is required to authenticate and access yodlee API's.
	 * @return JsonObject in string format.
	 * @throws IOException
	 * @throws URISyntaxException
	 * @throws InterruptedException
	 */
	
	public static String doGet(String url, Map<String,String> sessionTokens) throws IOException, URISyntaxException, InterruptedException {

		String mn="doIO(GET :" + url+ ")";
		URL myURL = new URL(url);

		HttpURLConnection conn = (HttpURLConnection) myURL.openConnection();
		conn.setRequestProperty("User-Agent", USERAGENT);
		conn.setRequestProperty("Authorization", sessionTokens.toString() );
		conn.setRequestProperty("Cobrand-Name",cobrandName);
		conn.setRequestProperty("Api-Version",apiVersion);
		conn.setDoOutput(true);
		System.out.println(FQCN + " :: " + mn + " : " + "Sending 'HTTP GET' request");
		int responseCode = conn.getResponseCode();
		System.out.println("---Request Header---");
		System.out.println("Authorization : "+ sessionTokens.toString());
		try{
		for(String header:HEADERS){
			if(conn.getRequestProperty(header)!=null)
			System.out.println(header+ " : " +conn.getRequestProperty(header));
			}
		System.out.println("Response code is :" + conn.getResponseCode());

		if (conn.getResponseCode()>210) {
			BufferedReader in= new BufferedReader(
					new InputStreamReader(conn.getErrorStream()));

			String inputLine;
			StringBuilder jsonResponse = new StringBuilder();
			while ((inputLine = in.readLine()) != null) {
				jsonResponse.append(inputLine);
			}
			in.close();
			System.out.println("Received error is " +jsonResponse);

		}

	
			BufferedReader in = new BufferedReader(
					new InputStreamReader(conn.getInputStream()));

			String inputLine;
			StringBuilder jsonResponse = new StringBuilder();
			while ((inputLine = in.readLine()) != null) {
				jsonResponse.append(inputLine);
			}
			in.close();
			String json=toPrettyFormat(jsonResponse.toString());
			System.out.println(json);
			return new String(jsonResponse);
		}catch (IOException ex){
			System.out.println(ex.getMessage());
			
		}
		
		finally {
	        if (conn != null) {
				 conn.disconnect();
			}
	    }
		return null;
	}
	/** Updates the resource with existingResourceId as the identifier, under the /resources URI.
	 * doPut() method is used to call UpdateAccount(providerAccounts),UpdateAccount(accounts) API.
	 * 
	 * @param url: API URL.
	 * @param param :Request body to update the data to the existing resourceID
	 * @param sessionTokens :cobrandSession and userSession is required to authenticate and access yodlee API's.
	 * @return JsonObject in string format.
	 * @throws IOException
	 * @throws URISyntaxException
	 * @throws InterruptedException
	 */



	public static String doPut(String url, String param, Map<String,String> sessionTokens) throws IOException, URISyntaxException, InterruptedException {
		String mn = "doIO(PUT :" + url + ", sessionTokens =  " + sessionTokens.toString() +" )";
		System.out.println(FQCN + " :: " + mn);
		param=param.replace("\"", "%22").replace("{", "%7B").replace("}", "%7D").replace(",", "%2C").replace("[", "%5B").replace("]", "%5D").replace(":", "%3A").replace(" ", "+");
		String processedURL = url+"?MFAChallenge="+param;//"%7B%22loginForm%22%3A%7B%22formType%22%3A%22token%22%2C%22mfaTimeout%22%3A%2299380%22%2C%22row%22%3A%5B%7B%22id%22%3A%22token_row%22%2C%22label%22%3A%22Security+Key%22%2C%22form%22%3A%220001%22%2C%22fieldRowChoice%22%3A%220001%22%2C%22field%22%3A%5B%7B%22id%22%3A%22token%22%2C%22name%22%3A%22tokenValue%22%2C%22type%22%3A%22text%22%2C%22value%22%3A%22123456%22%2C%22isOptional%22%3Afalse%2C%22valueEditable%22%3Atrue%2C%22maxLength%22%3A%2210%22%7D%5D%7D%5D%7D%7D";
		URL myURL = new URL(processedURL);
		System.out.println(FQCN + " :: " + mn + ": Request URL=" + processedURL.toString());
		HttpURLConnection conn = (HttpURLConnection) myURL.openConnection();
		conn.setRequestMethod("PUT");
        conn.setRequestProperty("Accept-Charset", "UTF-8");
		conn.setRequestProperty("Content-Type",CONTENTTYPEURLENCODED );
		conn.setRequestProperty("Authorization", sessionTokens.toString() );
		conn.setRequestProperty("Cobrand-Name",cobrandName);
		conn.setRequestProperty("Api-Version",apiVersion);
		conn.setDoOutput(true);
		System.out.println(FQCN + " :: " + mn + " : " + "Sending 'HTTP PUT' request");
		try{
		for(String header:HEADERS){
			if(conn.getRequestProperty(header)!=null)
			System.out.println(header+ " : " +conn.getRequestProperty(header));
			}
		System.out.println("Response code is :" + conn.getResponseCode());
		if (conn.getResponseCode()>210) {
			BufferedReader in= new BufferedReader(
					new InputStreamReader(conn.getErrorStream()));

			String inputLine;
			StringBuilder jsonResponse = new StringBuilder();
			while ((inputLine = in.readLine()) != null) {
				jsonResponse.append(inputLine);
			}
			in.close();
			System.out.println("Received error is " +jsonResponse);

		}

	
			BufferedReader in = new BufferedReader(
					new InputStreamReader(conn.getInputStream()));

			String inputLine;
			StringBuilder jsonResponse = new StringBuilder();
			while ((inputLine = in.readLine()) != null) {
				jsonResponse.append(inputLine);
			}
			in.close();
			String json=toPrettyFormat(jsonResponse.toString());
			System.out.println(json);
			return new String(jsonResponse);
		}catch (IOException ex){
			 System.out.println(ex.getMessage());
		}
		finally {
	        if (conn != null) {
				 conn.disconnect();
			}
	    }
		return null;
	}
	
	/** Updates the resource with existingResourceId as the identifier, under the /resources URI.
	 * doPutNew() method is used to call UpdateAccount(providerAccounts),UpdateAccount(accounts) API.
	 * 
	 * @param url: API URL.
	 * @param param :Request body to update the data to the existing resourceID
	 * @param sessionTokens :cobrandSession and userSession is required to authenticate and access yodlee API's.
	 * @return JsonObject in string format.
	 * @throws IOException
	 * @throws URISyntaxException
	 * @throws InterruptedException
	 */

	public static String doPutNew(String url, String param, Map<String,String> sessionTokens) throws IOException, URISyntaxException, InterruptedException {
		String mn = "doIO(PUT :" + url + ", sessionTokens =  " + sessionTokens.toString() +" )";
		String processedURL = url;//+"?MFAChallenge="+param;//"%7B%22loginForm%22%3A%7B%22formType%22%3A%22token%22%2C%22mfaTimeout%22%3A%2299380%22%2C%22row%22%3A%5B%7B%22id%22%3A%22token_row%22%2C%22label%22%3A%22Security+Key%22%2C%22form%22%3A%220001%22%2C%22fieldRowChoice%22%3A%220001%22%2C%22field%22%3A%5B%7B%22id%22%3A%22token%22%2C%22name%22%3A%22tokenValue%22%2C%22type%22%3A%22text%22%2C%22value%22%3A%22123456%22%2C%22isOptional%22%3Afalse%2C%22valueEditable%22%3Atrue%2C%22maxLength%22%3A%2210%22%7D%5D%7D%5D%7D%7D";
		URL myURL = new URL(processedURL);
		HttpURLConnection conn = (HttpURLConnection) myURL.openConnection();
		conn.setRequestMethod("PUT");
        conn.setRequestProperty("Accept-Charset", "UTF-8");
		conn.setRequestProperty("Content-Type",CONTENTTYPEJSON );
		conn.setRequestProperty("Authorization", sessionTokens.toString());
		conn.setRequestProperty("Cobrand-Name",cobrandName);
		conn.setRequestProperty("Api-Version",apiVersion);
		conn.setDoOutput(true);
		DataOutputStream wr = new DataOutputStream(conn.getOutputStream());
		try{
		wr.writeBytes(param);
		System.out.println(FQCN + " :: " + mn + " : " + "Sending 'HTTP PUT' request");
		for(String header:HEADERS){
			if(conn.getRequestProperty(header)!=null)
			System.out.println(header+ " : " +conn.getRequestProperty(header));
			}
		System.out.println("Response code is :" + conn.getResponseCode());
		if (conn.getResponseCode()>210) {
			BufferedReader in= new BufferedReader(
					new InputStreamReader(conn.getErrorStream()));

			String inputLine;
			StringBuilder jsonResponse = new StringBuilder();
			while ((inputLine = in.readLine()) != null) {
				jsonResponse.append(inputLine);
			}
			in.close();
			System.out.println("Received error is " +jsonResponse);

		}

	
			BufferedReader in = new BufferedReader(
					new InputStreamReader(conn.getInputStream()));

			String inputLine;
			StringBuilder jsonResponse = new StringBuilder();
			while ((inputLine = in.readLine()) != null) {
				jsonResponse.append(inputLine);
			}
			in.close();
			String json=toPrettyFormat(jsonResponse.toString());
			System.out.println(json);
			
			return new String(jsonResponse);
		}catch (IOException ex){
			System.out.println(ex.getMessage());
		}
		finally {
	        try {
	            if (conn != null) {
	            	 conn.disconnect();
	            }
	            if (wr != null) {
	            	wr.flush();
	            	wr.close();
	            }
	        } catch (IOException ex) {
	        	System.out.println(ex.getMessage());
	        }
	    }
		return null;
	}
	
	/**
	 * Deletes the specified resource
	 * doDelete() method is used to call DeleteProviderAccount,DeleteCategory API etc.
	 * 
	 * @param url : API URL.
	 * @param sessionTokens ::cobrandSession and userSession is required to authenticate and access yodlee API's.
	 * @return empty body.
	 * @throws IOException
	 * @throws URISyntaxException
	 */
	public static String doDelete(String url, Map<String,String> sessionTokens) throws IOException, URISyntaxException
	{
		System.out.println("-------------------DELETE request start----------------------");
		String mn = "doIO(Delete :" + url+ ", sessionTokens =  " + sessionTokens.toString() +" )";
		//System.out.println(FQCN + " :: " + mn);
		URL myURL = new URL(url);
		//System.out.println(FQCN + " :: " + mn + ": Request URL=" + url.toString());
		HttpURLConnection conn = (HttpURLConnection) myURL.openConnection();
		conn.setRequestMethod("DELETE");
		conn.setRequestProperty("User-Agent", USERAGENT);
		//conn.setRequestProperty("Content-Type", CONTENTTYPEJSON);
		//conn.setRequestProperty("Accept",);
		conn.setRequestProperty("Cobrand-Name",cobrandName);
		conn.setRequestProperty("Api-Version",apiVersion);
		conn.setRequestProperty("Authorization", sessionTokens.toString() );
		conn.setDoOutput(true);
		System.out.println(FQCN + " :: " + mn + " : " + "Sending 'HTTP GET' request");
		StringBuilder jsonResponse = new StringBuilder();
		System.out.println("---Request Header---");
		System.out.println("Authorization : "+ sessionTokens.toString());
		try{
		for(String header:HEADERS){
			if(conn.getRequestProperty(header)!=null)
			System.out.println(header+ " : " +conn.getRequestProperty(header));
			
			}
		System.out.println("Response code is :" + conn.getResponseCode());
		//System.out.println(FQCN + " :: " + mn + " : "+ "Response Code : " + responseCode);
		BufferedReader in = new BufferedReader(
		        new InputStreamReader(conn.getInputStream()));
		String inputLine;	
		while ((inputLine = in.readLine()) != null) 
		{
			System.out.println(inputLine);
			jsonResponse.append(inputLine);
		}
		in.close();
		System.out.println("-------------------DELETE request end----------------------");
		}catch (IOException ex){
			System.out.println(ex.getMessage());
			}
			finally {
		            if (conn != null) {
		            	conn.disconnect();
		            	}		        
		    }
		return new String(jsonResponse);
	}
	
	/**
	 * To format the received json from API's
	 * 
	 * @param jsonResponse : API response.
	 * @return
	 */
	
	public static String toPrettyFormat(String jsonResponse) 
	  {
	      JsonParser parser = new JsonParser();
	      JsonObject json = parser.parse(jsonResponse).getAsJsonObject();

	      Gson gson = new GsonBuilder().setPrettyPrinting().create();
	      String prettyJson = gson.toJson(json);

	      return prettyJson;
	  }
	
	
	public static void main(String[] args) 
	{
		// TODO Auto-generated method stub

	}

	/**
	 * performs submission of data to be processed to a specified resource
	 * doPostRegisterUser() method is to call RegisterUser API.
	 * @param url : API url.
	 * @param registerParam :requestBody to post the data to the API.
	 * @param cobTokens : cobrandSession is required to authenticate and access yodlee API's.
	 * @param isEncodingNeeded :specialized format is required or not.
	 * @return JsonObject in string format.
	 * @throws IOException
	 */

	
	public static String doPostRegisterUser(String url, String registerParam,Map<String,String> cobTokens,boolean isEncodingNeeded) throws IOException{
		
		registerParam = java.net.URLEncoder. encode(registerParam, "UTF-8");
		 String processedURL = url+"?registerParam="+registerParam;
		String mn = "doIO(POST : " + processedURL + ", " + registerParam+ "sessionTokens : "  +" )";
		System.out.println(FQCN + " :: " + mn);
		URL restURL = new URL(processedURL);
		HttpURLConnection conn = (HttpURLConnection) restURL.openConnection();
		conn.setRequestMethod("POST");
		conn.setRequestProperty("User-Agent", USERAGENT);
		conn.setRequestProperty("Content-Type", CONTENTTYPEURLENCODED);
		conn.setRequestProperty("Content-Type", "text/plain;charset=UTF-8");
		conn.setRequestProperty("Authorization", cobTokens.toString() );
		conn.setDoOutput(true);
        conn.setRequestProperty("Accept-Charset", "UTF-8");
		int responseCode = conn.getResponseCode();
		try{
		if(responseCode == 200){
		System.out.println(FQCN + " :: " + mn + " : " + "Sending 'HTTP POST' request");
			System.out.println("Response code is :" + conn.getResponseCode());
			
		BufferedReader in = new BufferedReader(
		        new InputStreamReader(conn.getInputStream()));
		String inputLine;
		StringBuilder jsonResponse = new StringBuilder();
		while ((inputLine = in.readLine()) != null) {
			jsonResponse.append(inputLine);
		}
		in.close();
		System.out.println(FQCN + " :: " + mn + " : "+ jsonResponse.toString());
		return new String(jsonResponse);
		}else{
			System.out.println("Invalid input");
			return new String();

		}
	} catch (IOException ex){
		System.out.println(ex.getMessage());
		}
		finally {
	        
	            if (conn != null) {
	            	conn.disconnect();
	            }
	            
	    }
		return null;
		
	}

	
	
}




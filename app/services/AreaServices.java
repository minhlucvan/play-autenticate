package services;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Scanner;
import java.util.Map.Entry;

import com.avaje.ebean.Ebean;
import com.fasterxml.jackson.databind.JsonNode;

import models.AreaData;
import models.AreaMap;
import models.AreaSumary;
import play.Play;
import play.libs.Json;
import utils.AreaUtils;

public class AreaServices {
	
	/**
	 * 
	 */
	private static String FILE_DATA_NAME = Play.application().configuration().getString("file.data.fileName");
	
	private static String FILE_MAP_NAME = Play.application().configuration().getString("file.map.fileName");
					
	/**
	 * This function is used to import and overwrite new area map to database follow file name
	 * 
	 * @param fileName : file name of area map
	 * @return true if import success
	 */
	private static boolean importAreaMap(String fileName) {
		try {
			
			// read area map from file
			InputStream inputStream = Play.application().classloader().getResourceAsStream(fileName);
			Scanner scanner = new Scanner(inputStream, "utf-8");
			String text = scanner.useDelimiter("\\Z").next();
			scanner.close();
			
			// delete old area map
			AreaMap areaMap = getMap();
			if (areaMap != null) {
				Ebean.delete(areaMap);
			}
			
			// save new area map
			areaMap = new AreaMap();
			areaMap.setName(fileName); 
			areaMap.setData(text);
			Ebean.save(areaMap);
			
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}
	
	/**
	 * This function is used to import and overwrite data to database follow file name
	 * 
	 * @param fileName : file name of area data
	 * @return
	 */
	private static boolean importAreaData(String fileName) {
		try {
			
			// read area data from file
			InputStream inputStream = Play.application().classloader().getResourceAsStream(fileName);
						
			JsonNode json = Json.parse(inputStream);
			Iterator<Entry<String, JsonNode>> areaDatas = json.fields();			
			while (areaDatas.hasNext()) {	
				Entry<String, JsonNode> area = areaDatas.next();
				String areaKey = area.getKey();
				JsonNode node = area.getValue();
								
				AreaData areaData = Ebean.find(AreaData.class).where().ieq("areaCode", areaKey).findUnique();
				
				if (areaData != null) {
					Ebean.delete(areaData);
				}
								
				areaData = new AreaData();
				
				areaData.setAreaCode(areaKey);
				Iterator<Entry<String, JsonNode>> datas = node.fields();
				List<AreaSumary> areaSumaries = new ArrayList<AreaSumary>();
				while (datas.hasNext()) {
					Entry<String, JsonNode> data = datas.next();
					String key = data.getKey();
					AreaSumary areaSumary = new AreaSumary();
					String arr[] = key.split("_");
					areaSumary.setCategory(arr[0]);
					areaSumary.setName(key);
					areaSumary.setValue(data.getValue().asText());
					areaSumaries.add(areaSumary);
				}
				areaData.setInfomations(areaSumaries);
				
				Ebean.save(areaData);
			}
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}

	/**
	 * This function is used to import data from file to database
	 */
	public static boolean importData() {
		try {
			if (FILE_DATA_NAME != null && !FILE_DATA_NAME.isEmpty()) {
				importAreaData(FILE_DATA_NAME);
			}
			
			if (FILE_MAP_NAME != null && !FILE_MAP_NAME.isEmpty()) {
				importAreaMap(FILE_MAP_NAME);
			}
		} catch (Exception e) {
			return false;
		}
		return true;
	}
	
	/**
	 * This function is used to get area data
	 * 
	 * @param areaCode : code of area
	 * @param category : type for using in chart
	 * @return
	 */
	public static Map<String, String> getData(String areaCode, String category) {
		Map<String, String> data = new Hashtable<>();
		List<AreaSumary> areaSumaries;
		if (category != null && !category.isEmpty()) {
			areaSumaries = Ebean.find(AreaSumary.class).fetch("areaData").where()
					.ieq("areaData.areaCode", areaCode).ieq("category", category)
					.findList();
		} else {
			areaSumaries = Ebean.find(AreaSumary.class).fetch("areaData").where()
			.ieq("areaData.areaCode", areaCode)
			.findList();
		}
				
		if (areaSumaries != null && areaSumaries.size() > 0) {
			for (AreaSumary areaSumary : areaSumaries) {
				if (AreaUtils.isValidNumber(areaSumary.getValue())) {
					data.put(areaSumary.getName(), areaSumary.getValue());
				}
			}
		}
		
		return data;
	}
	
	/**
	 * This function is used to get area map
	 * 
	 * @return area map if exist
	 */
	public static AreaMap getMap() {		
		return Ebean.find(AreaMap.class).findUnique();
	}
}

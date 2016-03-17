package utils;

public class AreaUtils {
	public static boolean isValidNumber(String value) {
		try {
			Double.parseDouble(value);
		} catch (Exception e) {
			return false;
		}
		
		return true;
	}
}

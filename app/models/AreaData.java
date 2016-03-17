package models;

import java.util.List;
import java.util.UUID;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.avaje.ebean.Model;
//import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name="THT_AREA_DATA")
//@JsonIgnoreProperties(ignoreUnknown = true)
public class AreaData extends Model {

	@Id
	private UUID id;
			
	@Column(length=20)
	private String areaCode;
	
	@OneToMany(cascade=CascadeType.ALL)
	private List<AreaSumary> areaSumaries;

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public String getAreaCode() {
		return areaCode;
	}

	public void setAreaCode(String areaCode) {
		this.areaCode = areaCode;
	}

	public List<AreaSumary> getInfomations() {
		return areaSumaries;
	}

	public void setInfomations(List<AreaSumary> areaSumaries) {
		this.areaSumaries = areaSumaries;
	}
	
	
}

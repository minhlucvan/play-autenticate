package models;

import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;


@Entity
@Table(name="THT_AREA_SUMARY")
public class AreaSumary {
	@Id
	private UUID id;
			
	@ManyToOne()
	private AreaData areaData;
	
	@Column(length=20)
	private String category;
	
	@Column(length=20)
	private String name;
	
	@Column(length=20)
	private String value;

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public AreaData getAreaData() {
		return areaData;
	}

	public void setAreaData(AreaData areaData) {
		this.areaData = areaData;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}	
}

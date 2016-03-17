var initMapChart=function(dataGeo,domMap,domPieChart,domEdulevel,domFilterSelect,optionsMap)
{	
	var allPostCode=[];	 
	var defaultStyle={			
			weight: optionsMap.weightLayer,
			opacity: optionsMap.opacityLayer,
			color: optionsMap.boderColorLayer,
			dashArray: optionsMap.dashArrayLayer,
			fillOpacity: optionsMap.fillOpacityLayer,
			fillColor: optionsMap.fillColorLayer
	};
	var map = L.map(domMap);
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png?{foo}', {foo: 'bar'}).addTo(map);
	var geoLayer = L.geoJson(dataGeo, {
		style: function (feature) {
			return defaultStyle;
		},
		onEachFeature: onEachFeature
	}).addTo(map);
	map.fitBounds(geoLayer.getBounds());
	
	
	//Draw 
	var drawnItems = L.featureGroup().addTo(map);
	
	map.addControl(new L.Control.Draw({			
            draw: {
                marker: false
            },
			edit: { featureGroup: drawnItems }
	}));

	map.on('draw:created', function(event) {
		var layer = event.layer;
		drawnItems.addLayer(layer);
	});
	
	var selectLayerFilter =function(postCode)
	{	
		resetSelectLayerFilter();
		geoLayer.eachLayer(function(layer) {
			if(layer.feature.properties.PNRO==postCode)
			{
				highlightFeature(layer);
				return;
			}
		});  
	};
	
	var resetSelectLayerFilter=function()
	{
		geoLayer.setStyle(defaultStyle);
	};
	
	//Show select2 filter
	$(domFilterSelect).select2({
		placeholder: "Select a area...",
		allowClear: true,
		width: '100%',
		data: allPostCode
	})
	.on("select2:select", function(e) {	
		selectLayerFilter(e.params.data.id);
        onAreaSelect(e.params.data);
    })	
	.on("select2:unselect", function(e) {
		resetSelectLayerFilter();
        $(this).val(null).trigger('change');
    });
	$(domFilterSelect).select2("val", "");
	
	
	function highlightFeature(layer) {
		layer.setStyle({
			weight: optionsMap.weightSelectLayer,
			color: optionsMap.boderColorSelectLayer,
			dashArray: optionsMap.dashArraySelectLayer,			
			fillColor:optionsMap.fillColorSelectLayer 
		});

		if (!L.Browser.ie && !L.Browser.opera) {
			layer.bringToFront();
		}		
	};
	
	function resetHighlight(layer) {
		geoLayer.resetStyle(layer);
	};
	
	function onEachFeature(feature, layer) {
		var postCode = layer.feature.properties.PNRO;
		var props = layer.feature.properties 
		var name = props.NIMI;
		var id = layer._leaflet_id
		var area ={
			id: postCode, 
			text: name,
			layerId: id,
			properties: props
		};
		allPostCode.push(area);		
		layer.on({
			mouseover:function(e){
				highlightFeature(e.target);
			},
			mouseout:function(e){
				resetHighlight(e.target);
			},
			click: function(e){
				onAreaSelect(area);
			}
		});
	};

	//select area callback
	var onAreaSelect = function(area){
		var postalcode = area.id;
		var areaName = area.text;
		var selectedItems = $(domFilterSelect).val();
		if(selectedItems != postalcode){
			$(domFilterSelect).val(postalcode).trigger("change");
		}

		$.ajax({
			url:"/data/"+postalcode,
			type: 'GET',                        
			dataType: 'json',
			success: function(response, textStatus)
			{
				var age = window.dataAreas.getAges(response);
				agePieChart.data(age);
				agePieChart.staticInfo('Inhabitans', d3.format(',')(response.he_vakiy));
				var edu = window.dataAreas.getEduLevels(response);
				eduLevelChart.data(edu);
			}
		});
	}
	//map sidebars
	var leftSidebar = L.control.sidebar('sidebar-left', {
		position: 'left'
	});
	map.addControl(leftSidebar);

	var rightSideBar =  L.control.sidebar('sidebar-right', {
		position: 'right'
	});
	map.addControl(rightSideBar);
	
	var leftSidebarBtn = L.easyButton({
		position: 'topleft',
		states:[
	   {
			stateName: 'show',
			icon: '<img style="margin-top: 3px;  margin-left: -2px;" src="assets/images/icons/chart.png">',
			onClick: function(e){
			  leftSidebar.toggle();
			}
	   }]
	});

	leftSidebarBtn.addTo(map);
	
	var rightSideBarBtn = L.easyButton({
	    position: 'topright',
		states:[
		{
			stateName: 'show',
			icon: '<img style="margin-top: 3px;" src="assets/images/icons/filter.png">',
			onClick: function(e){
			  rightSideBar.toggle();
			}
		 }]
	});

	rightSideBarBtn.addTo(map);

	//test charts
	function initAgesChart(){
		var chart = Chart.desPieChart();
		chart.width(400);
		chart.infoTitle(function(d){
			return d.name;
		});
		chart.infoContent(function(d){
			return d3.format(',')(d.value) + '<br>'
				+ d3.format('.2%')(d.percent) +' inhabitans';
		});

		return chart;
	}
	var eduLevelChart = Chart.barChart().width(400).height(200).tooltip(true);
	var agePieChart = initAgesChart();
	d3.json('data/Finland', function(e, d){
	  if(e) throw e;
	  d3.select(domPieChart).append('h2').text("age discrimination");
	  
	  agePieChart.staticInfo('Inhabitans',d3.format(',')(d.he_vakiy));
	  var age = window.dataAreas.getAges(d);
	  agePieChart.data(age);
	  d3.select(domPieChart).append('div').call(agePieChart);

	  d3.select(domEdulevel).append('h2').text("educational level discrimination");
	  var edu = window.dataAreas.getEduLevels(d);
	  eduLevelChart.data(edu);
	  d3.select(domEdulevel).call(eduLevelChart);
	  eduLevelChart.data(edu);
	  eduLevelChart.getTooltip().content(function(d, i){
			return d3.format(',')(d.value) + "<br>" + d3.format(".2%")(d.percent) + " inhabitans";
		})
		.size(210, 100);
	});

	leftSidebar.show();
	
	
};


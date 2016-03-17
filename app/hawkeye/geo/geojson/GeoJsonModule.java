package hawkeye.geo.geojson;

import com.fasterxml.jackson.databind.module.SimpleModule;
import com.vividsolutions.jts.geom.*;

public class GeoJsonModule extends SimpleModule {

    /**
	 * 
	 */
	private static final long serialVersionUID = 4483195510868307895L;
	@SuppressWarnings("rawtypes")
	static GeometryDeserializer GEO_DE = new GeometryDeserializer();

    public GeoJsonModule() {
        this(null);
    }

    public GeoJsonModule(Integer precision) {
        // deserializers - Jackson requires a deserializer for each subclass of geometry
        //GeometryDeserializer de = new GeometryDeserializer();
        addDeserializer(Geometry.class, new GeometryDeserializer<Geometry>());
        addDeserializer(GeometryCollection.class, new GeometryDeserializer<GeometryCollection>());
        addDeserializer(Point.class, new GeometryDeserializer<Point>());
        addDeserializer(LinearRing.class, new GeometryDeserializer<LinearRing>());
        addDeserializer(LineString.class, new GeometryDeserializer<LineString>());
        addDeserializer(MultiLineString.class, new GeometryDeserializer<MultiLineString>());
        addDeserializer(MultiPoint.class, new GeometryDeserializer<MultiPoint>());
        addDeserializer(MultiPolygon.class, new GeometryDeserializer<MultiPolygon>());
        addDeserializer(Polygon.class, new GeometryDeserializer<Polygon>());
        addDeserializer(Envelope.class, new EnvelopeDeserializer());

        // serializers
        addSerializer(Geometry.class, new GeometrySerializer(precision));
        addSerializer(Envelope.class, new EnvelopeSerializer(precision));
    }

}

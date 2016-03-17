package hawkeye.geo;


public interface FeatureFilter {
    boolean accept(Feature feature);
}
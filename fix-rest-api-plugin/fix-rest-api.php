<?php
/**
 * Plugin Name: Fix REST API URL
 * Description: Fixes REST API URL mismatch so Rank Math SEO can save data
 * Version: 1.0
 * Author: EDA Dev
 */

add_filter('rest_url', function($url) {
    return str_replace('www.edaperfumes.com', 'cms.edaperfumes.com', $url);
});

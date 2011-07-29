<?php

//$response = wp_remote_get('http://wordpress.org');

$c = curl_init();

curl_setopt($c, CURLOPT_URL, "http://vimeo.com/api/v2/fmenterprises/videos.json");
//url we want to load

curl_setopt($c, CURLOPT_HEADER, false);
//true - return the HTTP headers as part of the text, false - NO headers

curl_setopt($c, CURLOPT_RETURNTRANSFER, true);
//I want the page returned as a string	- if false then it returns 1 or 0

$pagedata = curl_exec($c);

$videosObj = json_decode($pagedata, true);
$smallerObject;

for($i = 0; $i <= 19; $i++) {
	$smallerObject[$i]['id'] = $videosObj[$i]['id'];
	$smallerObject[$i]['thumbnail_large'] = $videosObj[$i]['thumbnail_large'];
}

$AbreviatedVidData = json_encode($smallerObject);

header("HTTP/1.1: 200");
header("Content-Type: text/json");
echo $AbreviatedVidData;

curl_close($c);



?>
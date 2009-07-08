<?php

$my_path = 'ffvigcache.xpi';
header('Content-type: application/x-xpinstall');
header("Content-Length: ".filesize($my_path));
header('Content-Transfer-Encoding: binary');
 
readfile($my_path);

?>
    

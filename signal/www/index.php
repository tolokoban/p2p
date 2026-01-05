<?php
/*********************************************************
PHP Signaling Server

Allow WebRTC connection between two peers A and B.
A is the initiator of the communication.

*********************************************************/


session_start();

if (!isset($_SESSION['count'])) {
    $_SESSION['count'] = 0;
} else {
    $_SESSION['count']++;
}
echo "<h1>Test 1</h1>";

echo "<ul><li>Count: " . $_SESSION['count']
    . "</li><li>Session: " . session_id()
    . "</li><li>SID: " . htmlspecialchars(SID)
    . "</li></ul>";

phpinfo();
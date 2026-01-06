<?php
/*********************************************************
PHP Signaling Server

Allow WebRTC connection between two peers A and B.
A is the initiator of the communication.

*********************************************************/

function setOffer($offer)
{
    session_start();
    $_SESSION["offer"] = $offer;
    return ["id" => session_id()];
}

function setAnswer($answer)
{
    session_start();
    $_SESSION["answer"] = $answer;
    return ["id" => session_id()];
}

function getOffer()
{
    session_start();
    return ["offer" => $_SESSION['offer']];
}

function getAnswer()
{
    session_start();
    return ["answer" => $_SESSION['answer']];
}

function execute()
{
    $service = @$_REQUEST['s'];
    $input = @$_REQUEST['i'];

    switch ($service) {
        case 'set-offer':
            return setOffer($input);
        case 'set-answer':
            return setAnswer($input);
        case 'get-offer':
            return getOffer();
        case 'get-answer':
            return getAnswer();
        default:
            return "Unknown service \"$service\"!";
    }
}

$output = null;
ob_start();
$key = @$_REQUEST['k'];
if (is_string($key) && strlen($key) > 0) {
    session_id($key);
}
try {
    $output = execute();
} catch (Exception $e) {
    $output = [
        "type" => "error",
        "message" => $e->getMessage()
    ];
}
ob_clean();
echo json_encode($output);

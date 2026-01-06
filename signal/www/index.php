<?php
/*********************************************************
PHP Signaling Server

Allow WebRTC connection between two peers A and B.
A is the initiator of the communication.

*********************************************************/

header('Access-Control-Allow-Origin: *');
header("Content-Type: application/json; charset=UTF-8");


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
    try {
        $content = trim(file_get_contents("php://input"));
        $data = json_decode($content, true);
        @$service = $data['s'];
        @$input = $data['i'];
        @$key = $data['k'];
    } catch (Exception $e) {
        return [
            "type" => "error",
            "message" => "Unable to parse parameters!",
            "args" => $_REQUEST
        ];
    }
    session_id($key);

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
            return [
                "type" => "error",
                "message" => "Unknown service \"$service\"!",
                "args" => $_REQUEST
            ];
    }
}

$output = null;
ob_start();
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

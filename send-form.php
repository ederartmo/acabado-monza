<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Método no permitido.']);
    exit;
}

if (!empty($_POST['sitio'] ?? '')) {
    echo json_encode(['ok' => true]);
    exit;
}

function clean_value(string $key): string
{
    $value = trim((string)($_POST[$key] ?? ''));
    $value = strip_tags($value);
    return preg_replace('/[\r\n]+/', ' ', $value) ?? '';
}

$fields = [
    'nombre' => clean_value('nombre'),
    'empresa' => clean_value('empresa'),
    'telefono' => clean_value('telefono'),
    'email' => clean_value('email'),
    'ciudad' => clean_value('ciudad'),
    'tipoProducto' => clean_value('tipo-producto'),
    'material' => clean_value('material'),
    'mensaje' => trim(strip_tags((string)($_POST['mensaje'] ?? ''))),
];

$required = ['nombre', 'telefono', 'email', 'tipoProducto', 'material', 'mensaje'];

foreach ($required as $field) {
    if ($fields[$field] === '') {
        http_response_code(422);
        echo json_encode(['ok' => false, 'message' => 'Completa todos los campos requeridos.']);
        exit;
    }
}

if (!filter_var($fields['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'message' => 'Ingresa un correo válido.']);
    exit;
}

$to = 'info@acabadosmonza.com';
$copy = 'acabadosmonza@outlook.com';
$from = 'info@acabadosmonza.com';
$subject = 'Nueva solicitud de asesoria - ' . $fields['nombre'];

$body = implode("\n", [
    'Nueva solicitud desde acabadosmonza.com',
    '',
    'Nombre: ' . $fields['nombre'],
    'Empresa/Taller: ' . ($fields['empresa'] !== '' ? $fields['empresa'] : 'No especificado'),
    'Telefono/WhatsApp: ' . $fields['telefono'],
    'Correo: ' . $fields['email'],
    'Ciudad: ' . ($fields['ciudad'] !== '' ? $fields['ciudad'] : 'No especificado'),
    'Tipo de producto: ' . $fields['tipoProducto'],
    'Material: ' . $fields['material'],
    '',
    'Necesidad/Proyecto:',
    $fields['mensaje'],
]);

$replyName = addcslashes($fields['nombre'], '"\\');
$headers = [
    'From: Acabados Monza <' . $from . '>',
    'Reply-To: "' . $replyName . '" <' . $fields['email'] . '>',
    'Bcc: ' . $copy,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion(),
];

$sent = mail($to, $subject, $body, implode("\r\n", $headers), '-f' . $from);

if (!$sent) {
    $sent = mail($to, $subject, $body, implode("\r\n", $headers));
}

if (!$sent) {
    http_response_code(502);
    echo json_encode(['ok' => false, 'message' => 'No se pudo enviar el correo.']);
    exit;
}

$confirmationSubject = 'Recibimos tu solicitud - Acabados Monza';
$confirmationBody = implode("\n", [
    'Hola ' . $fields['nombre'] . ',',
    '',
    'Gracias por contactar a Acabados Monza. Recibimos tu solicitud correctamente y nuestro equipo ya la esta revisando.',
    '',
    'Resumen de tu solicitud:',
    'Telefono/WhatsApp: ' . $fields['telefono'],
    'Tipo de producto: ' . $fields['tipoProducto'],
    'Material: ' . $fields['material'],
    '',
    'Nos pondremos en contacto contigo lo antes posible.',
    '',
    'Acabados Monza',
    'info@acabadosmonza.com',
]);

$confirmationHeaders = [
    'From: Acabados Monza <' . $from . '>',
    'Reply-To: Acabados Monza <' . $from . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion(),
];

mail($fields['email'], $confirmationSubject, $confirmationBody, implode("\r\n", $confirmationHeaders), '-f' . $from);

echo json_encode(['ok' => true]);
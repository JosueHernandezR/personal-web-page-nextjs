const fetch = require('node-fetch');

async function testEmail() {
  console.log('🧪 Probando envío de email localmente...\n');
  
  const testData = {
    name: 'Test Usuario',
    email: 'test@example.com',
    subject: 'Prueba desde script local',
    message: 'Este es un mensaje de prueba para verificar que el sistema de email funciona correctamente.'
  };

  try {
    console.log('📤 Enviando datos de prueba:', testData);
    console.log('🌐 URL:', 'http://localhost:3000/api/contact/local-test');
    
    const response = await fetch('http://localhost:3000/api/contact/local-test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();
    
    console.log('\n📊 Respuesta del servidor:');
    console.log('Status:', response.status);
    console.log('Resultado:', JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log('\n✅ ¡Email enviado exitosamente!');
      console.log('Message ID:', result.messageId);
    } else {
      console.log('\n❌ Error al enviar email:');
      console.log('Error:', result.error);
      console.log('Detalles:', result.details);
      if (result.stack) {
        console.log('Stack trace:', result.stack);
      }
    }
    
  } catch (error) {
    console.error('\n💥 Error de conexión:', error.message);
    console.log('\n🔧 Asegúrate de que el servidor esté corriendo:');
    console.log('   npm run dev');
  }
}

testEmail(); 
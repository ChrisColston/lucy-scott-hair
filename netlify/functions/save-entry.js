// Simple Netlify function to save tracker entries
// Uses Netlify Forms as backup storage

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const entry = JSON.parse(event.body);
    
    // Basic validation
    if (!entry.type || !entry.date) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // For now, we'll log the entry and save it to a simple file-based storage
    // In production, you'd want to use a proper database like Supabase, Fauna, or Airtable
    
    console.log('Saving entry:', JSON.stringify(entry, null, 2));
    
    // Save to Netlify Forms as backup
    const formData = new URLSearchParams();
    formData.append('form-name', 'tracker-entries');
    formData.append('entry-id', entry.id);
    formData.append('entry-type', entry.type);
    formData.append('entry-date', entry.date);
    formData.append('entry-data', JSON.stringify(entry));
    
    // Submit to Netlify Forms
    const response = await fetch('https://lucyscotthair.co.uk/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        id: entry.id,
        timestamp: new Date().toISOString()
      }),
    };

  } catch (error) {
    console.error('Error saving entry:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

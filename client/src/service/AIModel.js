import { API_ENDPOINTS } from '@/config/api'

export async function generateSummaryWithAI(jobTitle, token) {
  try {
    const response = await fetch(API_ENDPOINTS.AI.GENERATE_SUMMARY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ jobTitle }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to generate summary');
    }

    const data = await response.json();
    return data.summary;
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new Error(error.message || 'Failed to generate summary');
  }
}

export async function generateExperienceDescription(position, company, industry = "Technology", token) {
  try {
    const response = await fetch(API_ENDPOINTS.AI.GENERATE_EXPERIENCE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        position,
        company,
        industry,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate experience description');
    }

    const data = await response.json();
    return data.description;
  } catch (error) {
    console.error('Error generating experience description:', error);
    throw error;
  }
}

export async function generateProjectDescription(projectName, technologies, role, token) {
  try {
    const response = await fetch(API_ENDPOINTS.AI.GENERATE_PROJECT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        projectName,
        technologies,
        role,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to generate project description');
    }

    const data = await response.json();
    return data.description;
  } catch (error) {
    console.error('Error generating project description:', error);
    throw new Error(error.message || 'Failed to generate project description');
  }
}
  


  
  

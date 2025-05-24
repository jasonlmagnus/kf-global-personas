import { NextResponse } from 'next/server';
import { getDashboardData, DashboardFilters } from '@/lib/surveyDataUtils';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('[API /survey-data] Attempting to get dashboard data...');
    
    // Parse query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const filters: DashboardFilters = {};
    
    // Extract filter parameters if present
    const personaRole = searchParams.get('personaRole');
    const industry = searchParams.get('industry');
    const country = searchParams.get('country');
    const companySize = searchParams.get('companySize');
    
    if (personaRole) filters.personaRole = personaRole;
    if (industry) filters.industry = industry;
    if (country) filters.country = country;
    if (companySize) filters.companySize = companySize;
    
    // Log what filters are being applied
    const hasFilters = Object.keys(filters).length > 0;
    if (hasFilters) {
      console.log(`[API /survey-data] Applying filters: ${JSON.stringify(filters)}`);
    } else {
      console.log('[API /survey-data] No filters applied - returning all data');
    }
    
    // Call getDashboardData with filters (if any)
    const data = await getDashboardData(hasFilters ? filters : undefined);
    
    console.log('[API /survey-data] Data fetched successfully. Sample:', JSON.stringify(data, null, 2).substring(0, 500) + '...'); // Log a sample
    
    if (!data || Object.keys(data).length === 0) {
      console.error('[API /survey-data] getDashboardData returned empty or null data.');
      return NextResponse.json({ message: 'Error: No data processed' }, { status: 500 });
    }
    
    // Check a specific part of the data that should have values
    if (data.strategicPriorities && data.strategicPriorities.overall) {
      console.log('[API /survey-data] Overall Strategic Priorities:', data.strategicPriorities.overall);
    } else {
      console.warn('[API /survey-data] Strategic priorities overall data is missing.');
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[API /survey-data] Error fetching survey data:', error);
    return NextResponse.json({ message: 'Error fetching survey data', error: error.message }, { status: 500 });
  }
} 
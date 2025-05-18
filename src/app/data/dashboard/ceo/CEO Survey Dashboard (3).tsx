import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [activeSectionId, setActiveSectionId] = useState('attraction');
  
  // All sections with their corresponding data
  const sections = [
    { id: 'attraction', name: '1. Job Attraction & Retention' },
    { id: 'environment', name: '2. Work Environment' },
    { id: 'ai', name: '3. AI & Future of Work' },
    { id: 'culture', name: '4. Workplace Culture' },
    { id: 'compensation', name: '5. Compensation & Security' },
    { id: 'inclusion', name: '6. Inclusion & Ethics' },
    { id: 'generations', name: '7. Intergenerational Work' },
    { id: 'satisfaction', name: '8. Job Satisfaction' }
  ];
  
  // Section data with narratives and questions - shortened to fit in one artifact
  // SECTION 1: Job Attraction & Retention
  const attraction = {
    title: '1. Job Attraction and Retention Factors',
    narrative: 'While CEOs strongly value advanced technologies (+33%) and environmental sustainability (+27%) when considering roles, they significantly undervalue job security (-25%) compared to other employees. This creates a critical blind spot when developing retention strategies. Additionally, CEOs are far less deterred by poor organizational culture (-65%) or inadequate learning opportunities (-65%) than their employees, potentially missing key retention drivers. For effective workforce strategies, CEOs must recognize these perception gaps rather than projecting their own priorities onto retention initiatives.',
    questions: [
      {
        id: 'q1',
        title: 'Q1: Important Factors When Looking for a New Job',
        question: 'If you were to look for a new job, what would be the most important factors for you?',
        data: [
          { name: 'Pay and compensation', ceoPercentage: 87, deviation: -1 },
          { name: 'Job security', ceoPercentage: 63, deviation: -25 },
          { name: 'The work itself', ceoPercentage: 92, deviation: 5 },
          { name: 'Employee benefits', ceoPercentage: 87, deviation: 3 },
          { name: 'Flexible work hours', ceoPercentage: 68, deviation: -12 },
          { name: 'Respect for personal priorities', ceoPercentage: 74, deviation: -6 },
          { name: 'Organization reputation', ceoPercentage: 85, deviation: 7 },
          { name: 'Career advancement', ceoPercentage: 92, deviation: 14 },
          { name: 'Commute to office', ceoPercentage: 68, deviation: -10 },
          { name: 'Learning opportunities', ceoPercentage: 78, deviation: 0 },
          { name: 'Colleagues', ceoPercentage: 82, deviation: 5 },
          { name: 'Organizational culture', ceoPercentage: 85, deviation: 10 },
          { name: 'Hiring manager I trust', ceoPercentage: 72, deviation: -3 },
          { name: 'Workplace policy', ceoPercentage: 68, deviation: -5 },
          { name: 'Organizational purpose', ceoPercentage: 89, deviation: 18 },
          { name: 'Inclusive policies', ceoPercentage: 81, deviation: 15 },
          { name: 'Social responsibility', ceoPercentage: 81, deviation: 15 },
          { name: 'Environmental sustainability', ceoPercentage: 89, deviation: 27 },
          { name: 'Advanced technologies', ceoPercentage: 92, deviation: 33 },
          { name: 'Visa sponsorship', ceoPercentage: 63, deviation: 17 }
        ]
      },
      {
        id: 'q3',
        title: 'Q3: Reasons for Leaving Current Employer',
        question: 'When considering the below options, which are most likely to make you leave your current company?',
        data: [
          { name: 'Poor pay and compensation', ceoPercentage: 68, deviation: -12 },
          { name: 'The work itself', ceoPercentage: 83, deviation: 6 },
          { name: 'Lack of job security', ceoPercentage: 54, deviation: -22 },
          { name: 'Inadequate employee benefits', ceoPercentage: 68, deviation: -6 },
          { name: 'Poor respect for personal priorities', ceoPercentage: 49, deviation: -24 },
          { name: 'Manager I don\'t trust', ceoPercentage: 54, deviation: -18 },
          { name: 'Colleagues I work with', ceoPercentage: 29, deviation: -42 },
          { name: 'Lack of flexible work hours', ceoPercentage: 29, deviation: -42 },
          { name: 'Commute to office', ceoPercentage: 29, deviation: -39 },
          { name: 'Poor organizational culture', ceoPercentage: 1, deviation: -65 },
          { name: 'Inadequate learning opportunities', ceoPercentage: 1, deviation: -65 },
          { name: 'Workplace policy', ceoPercentage: 1, deviation: -65 }
        ]
      }
    ]
  };
  
  // SECTION 2: Work Environment
  const environment = {
    title: '2. Work Environment and Modalities',
    narrative: 'CEOs demonstrate strong preference for hybrid work arrangements (+18% current, +10% ideal) while being less likely to believe employees should fully "switch off" after hours (-11%). This creates tension around work-life boundaries that may undermine the flexible work environments CEOs seek to create. Effective modern work policies must acknowledge this disconnect and establish clear expectations for availability that respect employee boundaries while meeting business needs.',
    questions: [
      {
        id: 'q4',
        title: 'Q4: Current and Ideal Work Location',
        question: 'Please confirm the location of your current place of work, and also where this would ideally be for you?',
        data: [
          { name: 'Current - Full-time in office', ceoPercentage: 45, deviation: -14 },
          { name: 'Current - Full-time remote', ceoPercentage: 9, deviation: -1 },
          { name: 'Current - Hybrid work', ceoPercentage: 45, deviation: 18 },
          { name: 'Current - Unsure', ceoPercentage: 1, deviation: -3 },
          { name: 'Ideal - Full-time in office', ceoPercentage: 12, deviation: -7 },
          { name: 'Ideal - Full-time remote', ceoPercentage: 21, deviation: -3 },
          { name: 'Ideal - Hybrid work', ceoPercentage: 58, deviation: 10 },
          { name: 'Ideal - Unsure', ceoPercentage: 9, deviation: 0 }
        ]
      },
      {
        id: 'q5',
        title: 'Q5: Expectations for "Switching Off"',
        question: 'Do you feel your company allows you to switch off at the end of the day without an expectation to answer emails or calls?',
        data: [
          { name: 'Yes, no expectation after logging off', ceoPercentage: 37, deviation: -11 },
          { name: 'Somewhat, urgent items only', ceoPercentage: 45, deviation: 6 },
          { name: 'Not at all, always available', ceoPercentage: 18, deviation: 5 }
        ]
      }
    ]
  };
  
  // SECTION 3: AI & Future of Work
  const ai = {
    title: '3. AI, Skills, and Future of Work',
    narrative: 'While CEOs show optimism about AI boosting their own value (+6%), they feel less strongly that their organizations encourage learning (-8%). This suggests potential underinvestment in the very capabilities necessary for successful technology adoption. To realize the innovation benefits highlighted in the CEO persona, organizations must close this capability gap by emphasizing structured learning opportunities that enable employees to effectively leverage emerging technologies.',
    questions: [
      {
        id: 'q6',
        title: 'Q6: Perceptions and Impact of AI',
        question: 'To what extent do you agree with the following statements about AI in the workplace and skills.',
        data: [
          { name: 'I feel my current skills will remain relevant in the next three years', ceoPercentage: 73, deviation: -1 },
          { name: 'My organization encourages and reinforces learning and development', ceoPercentage: 59, deviation: -8 },
          { name: 'I feel my company is focusing my development on the long-term goals of the company', ceoPercentage: 61, deviation: -2 },
          { name: 'I would stay at a job if it granted me opportunities to progress and upskill quickly, even if I hated the current role', ceoPercentage: 54, deviation: -9 },
          { name: 'My organization offers a broad enough range of learning approaches to suit my needs', ceoPercentage: 59, deviation: -4 },
          { name: 'My organization encourages experimentation with new technologies', ceoPercentage: 66, deviation: 4 },
          { name: 'I feel excited and positive about how emerging technologies like AI will change the way I work', ceoPercentage: 64, deviation: 3 },
          { name: 'I think using AI in my role will bolster my value in the next three years', ceoPercentage: 64, deviation: 6 },
          { name: 'When I\'ve been asked to use AI to help with my job, I found it produced better results and/or improved efficiency', ceoPercentage: 57, deviation: 0 },
          { name: 'I feel leaders in my organization understand AI', ceoPercentage: 54, deviation: -2 },
          { name: 'I feel adequately trained to use AI tools', ceoPercentage: 55, deviation: 0 },
          { name: 'I feel certain that my role will be replaced by AI/tech in the next three years', ceoPercentage: 41, deviation: -3 }
        ]
      }
    ]
  };
  
  // SECTION 4: Workplace Culture (shortened)
  const culture = {
    title: '4. Workplace Perceptions and Culture',
    narrative: 'CEOs significantly undervalue collegiate connections (-20%) and struggle with bringing their full selves to work (-18%) compared to other employees. This indicates that the psychological safety needed for innovation and engagement may be missing even at the highest levels of organizations. Building truly effective cultures requires acknowledging these vulnerabilities and creating environments where authenticity and connection are recognized as strategic assets rather than soft benefits.',
    questions: [
      {
        id: 'q7',
        title: 'Q7: General Workplace Statements (Part 1)',
        question: 'To what extent do you agree with the following statements with regards to your workplace.',
        data: [
          { name: 'I would be motivated to work harder if I only worked a 4-day week on the same salary', ceoPercentage: 68, deviation: -6 },
          { name: 'I feel that the job I do reflects my values', ceoPercentage: 74, deviation: 3 },
          { name: 'Connection with my colleagues is one of the most important things about my job', ceoPercentage: 51, deviation: -20 },
          { name: 'My company understands the importance of the benefits that come alongside a salary', ceoPercentage: 72, deviation: 4 },
          { name: 'I feel my company provides a variety of ways to communicate and connect with colleagues', ceoPercentage: 70, deviation: 2 },
          { name: 'I feel leaders in my company respect the needs of employees across generations', ceoPercentage: 61, deviation: -5 },
          { name: 'I feel my company provides adequate support for employee mental well-being', ceoPercentage: 54, deviation: -9 },
          { name: 'I have strong connections with my remote colleagues', ceoPercentage: 53, deviation: -6 },
          { name: 'I would stay at a job if it paid me the salary I want, even if I hated the role', ceoPercentage: 46, deviation: -13 },
          { name: 'I would stay at a job if it allowed me flexibility, even if I hated the role', ceoPercentage: 45, deviation: -13 },
          { name: 'My organization has taken steps to reduce cultural gaps between different generations of workers', ceoPercentage: 51, deviation: -7 },
          { name: 'I feel I work better with people my own age', ceoPercentage: 29, deviation: -25 }
        ]
      },
      {
        id: 'q9',
        title: 'Q9: Manager and Work Environment Statements',
        question: 'To what extent do you agree with the following statements.',
        data: [
          { name: 'I have the resources I need to deliver what is expected of me', ceoPercentage: 74, deviation: 4 },
          { name: 'My manager is supportive and helpful', ceoPercentage: 67, deviation: -1 },
          { name: 'I feel that I can be my full self around my co-workers', ceoPercentage: 49, deviation: -18 },
          { name: 'I am comfortable talking to my manager about needs related to my health and wellbeing', ceoPercentage: 62, deviation: -2 },
          { name: 'My manager empowers me', ceoPercentage: 52, deviation: -10 },
          { name: 'I feel that my ideas and opinions will be welcomed by company leaders', ceoPercentage: 55, deviation: -6 },
          { name: 'If a problem in my personal life is affecting my work/performance, I feel comfortable telling my manager about it', ceoPercentage: 48, deviation: -12 },
          { name: 'Our external reputation matches our internal culture', ceoPercentage: 55, deviation: -4 }
        ]
      }
    ]
  };
  
  // SECTION 5: Compensation & Security (shortened)
  const compensation = {
    title: '5. Compensation, Career, and Job Security',
    narrative: 'CEOs are substantially more likely to believe they are fairly compensated (+16%) and less concerned about cost of living (-12%) than other employees. This perception gap may explain why compensation strategies often fail to address actual employee concerns. Additionally, CEOs are far less worried about resume competitiveness (-24%) and job security (-14%), creating potential blindness to the economic anxiety driving employee decisions. Effective compensation strategies must bridge this gap by acknowledging financial concerns that CEOs may not personally experience.',
    questions: [
      {
        id: 'q10',
        title: 'Q10: General Statements on Career and Security',
        question: 'To what extent do you agree with the following statements.',
        data: [
          { name: 'I am concerned about the cost of living outpacing my current salary', ceoPercentage: 58, deviation: -12 },
          { name: 'My current role leaves me feeling fulfilled', ceoPercentage: 67, deviation: 1 },
          { name: 'I am open to changing industries to have better job security', ceoPercentage: 49, deviation: -14 },
          { name: 'I feel confident I could easily find a new role if I left my current company in the next few months', ceoPercentage: 65, deviation: 3 },
          { name: 'The organization handles decisions about people with sensitivity and care', ceoPercentage: 58, deviation: -1 },
          { name: 'I am worried about how to make my resume/ CV stand out in the competitive job market', ceoPercentage: 29, deviation: -24 },
          { name: 'My organization\'s leaders value people over profits', ceoPercentage: 32, deviation: -20 },
          { name: 'I am concerned about a lack of jobs for my skillset', ceoPercentage: 38, deviation: -9 }
        ]
      },
      {
        id: 'q11',
        title: 'Q11: Compensation for Skillset',
        question: 'How well do you think you are compensated for your skillset?',
        data: [
          { name: 'My company gives me a salary and benefits that exceed the value of my skills', ceoPercentage: 5, deviation: -1 },
          { name: 'My company gives me a salary and benefits that match the value of my skills', ceoPercentage: 74, deviation: 16 },
          { name: 'My company gives me a salary and benefits that are below the value of my skills', ceoPercentage: 21, deviation: -15 }
        ]
      }
    ]
  };
  
  // SECTION 6: Inclusion & Ethics
  const inclusion = {
    title: '6. Inclusion, Social Responsibility, and Ethics',
    narrative: 'CEOs are significantly more likely to believe their organizations have "just the right commitment" to CSR (+11%) and DEI (+12%), potentially creating complacency around initiatives that employees view differently. Interestingly, some CEOs also believe their companies are "not committed at all" (+6%), suggesting polarization in leadership views on these topics. Effective ESG strategies must reconcile these divergent perspectives by focusing on measurable impact rather than perception.',
    questions: [
      {
        id: 'q14a',
        title: 'Q14: Commitment to Corporate Social Responsibility',
        question: 'Is your company committed to corporate social responsibility and sustainability goals?',
        data: [
          { name: 'Far too committed', ceoPercentage: 5, deviation: -7 },
          { name: 'Slightly too committed', ceoPercentage: 4, deviation: -10 },
          { name: 'Just the right commitment', ceoPercentage: 58, deviation: 11 },
          { name: 'Not committed nearly enough', ceoPercentage: 17, deviation: 4 },
          { name: 'Not committed at all', ceoPercentage: 11, deviation: 6 },
          { name: 'Don\'t know / no opinion', ceoPercentage: 3, deviation: -5 }
        ]
      },
      {
        id: 'q14b',
        title: 'Q14: Commitment to Diversity, Equity & Inclusion',
        question: 'Is your company committed to Diversity, Equity & Inclusion (DE&I) in the workplace?',
        data: [
          { name: 'Far too committed', ceoPercentage: 4, deviation: -8 },
          { name: 'Slightly too committed', ceoPercentage: 5, deviation: -10 },
          { name: 'Just the right commitment', ceoPercentage: 60, deviation: 12 },
          { name: 'Not committed nearly enough', ceoPercentage: 16, deviation: 4 },
          { name: 'Not committed at all', ceoPercentage: 11, deviation: 6 },
          { name: 'Don\'t know / no opinion', ceoPercentage: 4, deviation: -3 }
        ]
      }
    ]
  };
  
  // SECTION 7: Intergenerational Collaboration
  const generations = {
    title: '7. Intergenerational Collaboration',
    narrative: 'CEOs are less likely to perceive challenges in generational collaboration (-9% for communication styles, -7% for leadership bias) and less interested in solutions like communication training (-10%) or values alignment (-9%). This suggests a potential dismissal of generational differences that many employees experience as significant. Building truly inclusive organizations requires acknowledging these differences and creating structured approaches to bridge them, even when leadership may not personally experience these challenges.',
    questions: [
      {
        id: 'q15',
        title: 'Q15: Challenges in Intergenerational Collaboration',
        question: 'What are the biggest challenges you face when working with colleagues from different generations?',
        data: [
          { name: 'Different communication styles', ceoPercentage: 31, deviation: -9 },
          { name: 'Gaps in technology skills', ceoPercentage: 35, deviation: 0 },
          { name: 'Conflicting values or priorities', ceoPercentage: 34, deviation: -1 },
          { name: 'Leadership bias towards specific age groups', ceoPercentage: 16, deviation: -7 },
          { name: 'I don\'t experience any challenges', ceoPercentage: 33, deviation: 5 }
        ]
      },
      {
        id: 'q16',
        title: 'Q16: Aids for Intergenerational Collaboration',
        question: 'Which of the following would help you collaborate better with colleagues from different generations?',
        data: [
          { name: 'Training on communication and teamwork', ceoPercentage: 36, deviation: -10 },
          { name: 'A stronger focus on shared values and goals', ceoPercentage: 36, deviation: -9 },
          { name: 'Technology training for bridging skill gaps', ceoPercentage: 35, deviation: -6 },
          { name: 'Reverse mentorship programmes', ceoPercentage: 14, deviation: -9 },
          { name: 'Training on how to work remotely with colleagues', ceoPercentage: 19, deviation: -3 },
          { name: 'None of these', ceoPercentage: 25, deviation: 8 }
        ]
      }
    ]
  };
  
  // SECTION 8: Job Satisfaction
  const satisfaction = {
    title: '8. Job Satisfaction and Organizational Performance',
    narrative: 'CEOs show alignment with employees on many job satisfaction metrics, though they are slightly less positive about learning opportunities (-6%) and less confident in the organization adapting to change (-9%). This suggests awareness of strategic challenges that may not be reflected in day-to-day conversations. Opening dialogue around these shared concerns can create authentic connection points between CEOs and employees, turning potential frustrations into opportunities for collaborative improvement.',
    questions: [
      {
        id: 'q17',
        title: 'Q17: General Organizational Statements',
        question: 'To what extent do you agree with the following statements.',
        data: [
          { name: 'My job makes good use of my skills and abilities', ceoPercentage: 76, deviation: 0 },
          { name: 'My job provides opportunities to do challenging and interesting work', ceoPercentage: 73, deviation: 0 },
          { name: 'I have good opportunities for learning and development at the company', ceoPercentage: 64, deviation: -6 },
          { name: 'The organization motivates me to do my best work', ceoPercentage: 71, deviation: 2 },
          { name: 'The organization is strategically adapting to changes in the business environment', ceoPercentage: 59, deviation: -9 },
          { name: 'I feel motivated to do more than is required of me', ceoPercentage: 61, deviation: -7 },
          { name: 'I have trust and confidence in the company\'s senior leadership team', ceoPercentage: 62, deviation: -5 },
          { name: 'The organization shows care and concern for its employees', ceoPercentage: 62, deviation: -5 }
        ]
      }
    ]
  };
  
  // Function to get active section data
  const getActiveSectionData = () => {
    switch(activeSectionId) {
      case 'attraction': return attraction;
      case 'environment': return environment;
      case 'ai': return ai;
      case 'culture': return culture;
      case 'compensation': return compensation;
      case 'inclusion': return inclusion;
      case 'generations': return generations;
      case 'satisfaction': return satisfaction;
      default: return attraction;
    }
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded shadow-md">
          <p className="font-bold">{data.name}</p>
          <p className="text-sm">CEO: {data.ceoPercentage}%</p>
          <p className="text-sm" style={{ color: data.deviation >= 0 ? '#16a34a' : '#dc2626' }}>
            Deviation: {data.deviation > 0 ? '+' : ''}{data.deviation}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-gray-200 bg-white p-4">
        <h1 className="text-2xl font-bold text-gray-800">CEO Survey Response Analysis</h1>
        <p className="text-gray-600">Last Updated: Sat May 17 08:55:44 BST 2025</p>
      </div>
      
      {/* Horizontal Tabs Navigation */}
      <div className="bg-white border-b border-gray-200 overflow-x-auto">
        <div className="flex">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSectionId(section.id)}
              className={`px-4 py-3 text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                activeSectionId === section.id
                  ? 'text-blue-700 border-b-2 border-blue-500'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {section.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-6">
        {/* Section Title and Narrative */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">{getActiveSectionData().title}</h2>
          
          {/* Narrative Section */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6 border-l-4 border-blue-500 mt-3">
            <h3 className="font-medium text-blue-800 mb-2">Section Analysis</h3>
            <p className="text-gray-700">{getActiveSectionData().narrative}</p>
          </div>
        </div>
        
        {/* Questions within the section */}
        {getActiveSectionData().questions.map(question => (
          <div key={question.id} className="mb-10 border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
            <h3 className="text-lg font-medium mb-1">{question.title}</h3>
            <p className="text-gray-600 mb-4 italic text-sm">"{question.question}"</p>
            
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={question.data}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[-70, 100]} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={300}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="ceoPercentage" 
                    name="CEO %" 
                    fill="#4299e1" 
                    barSize={20} 
                  />
                  <Bar 
                    dataKey="deviation" 
                    name="Deviation from Mean (%)" 
                    fill={(entry) => entry.deviation >= 0 ? '#68d391' : '#fc8181'} 
                    barSize={20} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border-b-2 border-gray-200 px-4 py-2 text-left">Factor</th>
                    <th className="border-b-2 border-gray-200 px-4 py-2 text-right">CEO %</th>
                    <th className="border-b-2 border-gray-200 px-4 py-2 text-right">Deviation</th>
                  </tr>
                </thead>
                <tbody>
                  {question.data.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="border-b border-gray-200 px-4 py-2">{item.name}</td>
                      <td className="border-b border-gray-200 px-4 py-2 text-right">{item.ceoPercentage}%</td>
                      <td className={`border-b border-gray-200 px-4 py-2 text-right ${
                        item.deviation > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.deviation > 0 ? '+' : ''}{item.deviation}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
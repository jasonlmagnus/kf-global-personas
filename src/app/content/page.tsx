"use client";

import React, { useState, useEffect } from "react";
import { Target, Users, BookOpen } from "lucide-react";

const ContentPage = () => {
  const [activeSection, setActiveSection] = useState("themes");
  const [contentData, setContentData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(
          "/content/kf-cross-persona-content-plan.md"
        );
        if (response.ok) {
          const text = await response.text();
          setContentData(text);
        }
      } catch (error) {
        console.error("Error fetching content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  const sections = [
    { id: "themes", name: "Themes", icon: Target },
    { id: "matrix", name: "Article Matrix", icon: Users },
    { id: "references", name: "References", icon: BookOpen },
  ];

  const themeData = [
    {
      id: 1,
      title: "AI-Accelerated Talent & Business Transformation",
      focus:
        "Bridging the gap between rapid AI adoption and organisational readiness, governance and skills.",
      services: "KF Assess & Assessment Analytics, AI-enabled RPO, Talent Hub",
      color: "#0E4230",
    },
    {
      id: 2,
      title: "Future-Skills & Human-Centred Leadership Development",
      focus:
        "Building scalable, human-centred leadership pipelines and skills portfolios for a hybrid world.",
      services: "Leadership Architect, KF Coach/Learn, Talent Hub",
      color: "#177D52",
    },
    {
      id: 3,
      title: "Total Rewards & EVP for Sustainable Growth",
      focus:
        "Delivering fair, competitive and holistic rewards that attract, retain and motivate talent in tight markets.",
      services: "Total Rewards Consulting, KF Pay analytics",
      color: "#FF6B00",
    },
  ];

  const articleMatrix = {
    theme1: [
      {
        persona: "CEO",
        title: "From AI Vision to Enterprise Value: A 90-Day C-Suite Playbook",
        offer: "KF Assess",
      },
      {
        persona: "CHRO",
        title: "Ethical-AI Governance in HR: Closing an 85-Point Readiness Gap",
        offer: "KF Assess",
      },
      {
        persona: "Global TA Leader",
        title:
          "Explainable-AI Hiring: Turning Compliance into Competitive Advantage",
        offer: "AI-enabled RPO & Talent Hub",
      },
      {
        persona: "Rewards Leader",
        title: "Pay-Equity Analytics in the Age of Generative AI",
        offer: "KF Pay",
      },
      {
        persona: "Sales Leader",
        title: "AI-Augmented Selling: How to Hit ±5 % Forecast Accuracy",
        offer: "KF Assess for Sales",
      },
      {
        persona: "Head of L&D",
        title: "Teaching Leaders to Lead AI: Building Fluency & Trust Together",
        offer: "KF Learn",
      },
    ],
    theme2: [
      {
        persona: "CEO",
        title: "Building a Culture Where Future Skills Thrive",
        offer: "Leadership Architect",
      },
      {
        persona: "CHRO",
        title: "Skills ROI: Mapping Learning Analytics to Growth KPIs",
        offer: "KF Learn",
      },
      {
        persona: "Global TA Leader",
        title:
          "Skills-Based Hiring & Internal Mobility: One Taxonomy to Rule Them All",
        offer: "Talent Hub",
      },
      {
        persona: "Rewards Leader",
        title: "Rewarding Growth: Incentive Designs that Fuel Upskilling",
        offer: "KF Pay",
      },
      {
        persona: "Sales Leader",
        title: "Manager-as-Coach: The Multiplier Effect on Quota & Retention",
        offer: "KF Coach",
      },
      {
        persona: "Head of L&D",
        title: "Hybrid Leadership Mastery: Trust & Performance Across Distance",
        offer: "KF Learn",
      },
    ],
    theme3: [
      {
        persona: "CEO",
        title:
          "Beyond Cost: Total Value Proposition as a Growth Lever in Tight Markets",
        offer: "Total Rewards Consulting",
      },
      {
        persona: "CHRO",
        title: "Well-Being & Rewards: A Duo for Trust",
        offer: "Total Rewards Consulting",
      },
      {
        persona: "Global TA Leader",
        title: "EVP Storytelling: Using Rewards Data to Win Scarce Skills",
        offer: "KF Pay",
      },
      {
        persona: "Rewards Leader",
        title: "Designing Competitive & Fair Rewards Across 150 Markets",
        offer: "KF Pay",
      },
      {
        persona: "Sales Leader",
        title:
          "Incentive Plans that Drive Customer Lifetime Value & Retain Stars",
        offer: "Total Rewards Consulting",
      },
      {
        persona: "Head of L&D",
        title: "Linking Learning Achievements to Recognition & Rewards",
        offer: "KF Pay + Learn",
      },
    ],
  };

  const renderThemes = () => (
    <div className="space-y-8">
      {/* Executive Summary */}
      <div
        className="p-6 rounded-lg border-l-4"
        style={{
          backgroundColor: "rgba(194, 217, 210, 0.5)",
          borderColor: "#0E4230",
        }}
      >
        <h3 className="font-semibold text-lg mb-3" style={{ color: "#0E4230" }}>
          Executive Summary
        </h3>
        <p className="text-gray-700 leading-relaxed">
          This plan delivers an 18-piece, persona-specific content programme
          that positions Korn Ferry's flagship solutions—KF Assess, Talent Hub,
          Leadership Architect, KF Pay and Total Rewards Consulting—as answers
          to the most urgent, shared challenges surfaced across six leadership
          personas. The themes are{" "}
          <strong>AI-Accelerated Transformation</strong>,{" "}
          <strong>Future-Skills & Human-Centred Leadership</strong>, and{" "}
          <strong>Total Rewards & EVP for Sustainable Growth</strong>. All
          DEI-specific language has been removed to avoid political
          sensitivities while retaining focus on performance, fairness and
          trust.
        </p>
      </div>

      {/* Comprehensive Theme Cards */}
      <div className="space-y-8">
        {/* Theme 1 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-4"
              style={{ backgroundColor: "#0E4230" }}
            >
              1
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                AI-Accelerated Talent & Business Transformation
              </h3>
              <p className="text-gray-600">
                Bridging the gap between rapid AI adoption and organisational
                readiness, governance and skills.
              </p>
            </div>
          </div>

          <div className="mb-4 p-4 bg-gray-50 rounded-md">
            <h4 className="font-medium text-gray-800 mb-2">
              Aligned Korn Ferry Service Lines
            </h4>
            <p className="text-sm text-gray-700">
              KF Assess & Assessment Analytics, AI-enabled RPO, Talent Hub
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">
                Cross-persona evidence
              </h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>
                  • CEOs report a <strong>24-point gap</strong> between AI
                  ambition and workforce readiness.
                </li>
                <li>
                  • CHROs highlight an{" "}
                  <strong>85-point "ambition–readiness" gulf</strong> within HR
                  itself.
                </li>
                <li>
                  • TA leaders note <strong>55% of recruiters</strong> feel
                  under-trained on AI hiring tools.
                </li>
                <li>
                  • Sales leaders see only <strong>25% of teams</strong>{" "}
                  forecasting within ±5% accuracy due to AI skill gaps.
                </li>
                <li>
                  • L&D leaders cite a <strong>61-point divide</strong> between
                  AI skills needed and programme coverage.
                </li>
                <li>
                  • Rewards leaders face rising mandates for{" "}
                  <strong>analytics-driven pay-equity audits</strong> as AI
                  transparency laws tighten.
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-800 mb-2">
                Business risk & opportunity
              </h4>
              <p className="text-sm text-gray-700">
                Silos in AI governance and capability stall ROI and heighten
                compliance risk. Firms that deploy{" "}
                <strong>
                  explainable AI, governance frameworks and rapid up-skilling
                </strong>{" "}
                can convert technology spend into measurable value.
              </p>
            </div>

            <div
              className="p-4 rounded-lg border-l-4"
              style={{
                backgroundColor: "rgba(14, 66, 48, 0.05)",
                borderColor: "#0E4230",
              }}
            >
              <h4 className="font-medium mb-2" style={{ color: "#0E4230" }}>
                🎯 How Korn Ferry Delivers Results
              </h4>
              <p className="text-sm text-gray-700 mb-3">
                <strong>KF Assess</strong> provides bias-audited algorithms for
                fair, explainable AI hiring decisions.{" "}
                <strong>AI-enabled RPO & Talent Hub</strong> create integrated
                talent acquisition and mobility platforms. Our{" "}
                <strong>leader AI-fluency academies</strong> form the complete
                "strategy-to-execution bridge" your organization needs.
              </p>
              <div className="text-xs font-medium" style={{ color: "#0E4230" }}>
                → Ready to close your AI readiness gap? Our consultants can
                assess your current state and design your transformation
                roadmap.
              </div>
            </div>
          </div>
        </div>

        {/* Theme 2 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-4"
              style={{ backgroundColor: "#177D52" }}
            >
              2
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                Future-Skills & Human-Centred Leadership Development
              </h3>
              <p className="text-gray-600">
                Building scalable, human-centred leadership pipelines and skills
                portfolios for a hybrid world.
              </p>
            </div>
          </div>

          <div className="mb-4 p-4 bg-gray-50 rounded-md">
            <h4 className="font-medium text-gray-800 mb-2">
              Aligned Korn Ferry Service Lines
            </h4>
            <p className="text-sm text-gray-700">
              Leadership Architect, KF Coach/Learn, Talent Hub
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">
                Cross-persona evidence
              </h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>
                  • HR reports only <strong>5% AI-ready</strong>, while 66% of
                  line leaders require AI fluency for new hires.
                </li>
                <li>
                  • Gen Z and millennials flag training as their{" "}
                  <strong>top retention driver</strong>.
                </li>
                <li>
                  • CHROs reveal <strong>49% of employees</strong> feel training
                  lags tech change.
                </li>
                <li>
                  • CEOs see a <strong>38-point deficit</strong> in enterprise
                  AI-skills confidence.
                </li>
                <li>
                  • Continuous sales-team coaching correlates with a{" "}
                  <strong>40% attrition drop</strong>.
                </li>
                <li>
                  • TA leaders pivot to <strong>skills-based hiring</strong> to
                  future-proof talent pipelines.
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-800 mb-2">
                Business risk & opportunity
              </h4>
              <p className="text-sm text-gray-700">
                Digital strategy stalls and attrition rises without accelerated
                re-skilling. Organisations that embed{" "}
                <strong>human-centred leadership and skills taxonomies</strong>{" "}
                close capability gaps and boost engagement.
              </p>
            </div>

            <div
              className="p-4 rounded-lg border-l-4"
              style={{
                backgroundColor: "rgba(23, 125, 82, 0.05)",
                borderColor: "#177D52",
              }}
            >
              <h4 className="font-medium mb-2" style={{ color: "#177D52" }}>
                🎯 How Korn Ferry Delivers Results
              </h4>
              <p className="text-sm text-gray-700 mb-3">
                <strong>Leadership Architect</strong> provides future-skills
                blueprints for role-specific development.{" "}
                <strong>KF Learn & Coach</strong> deliver AI-personalised
                learning paths that scale across your organization.{" "}
                <strong>Talent Hub</strong> enables unified skills taxonomy and
                internal mobility programs.
              </p>
              <div className="text-xs font-medium" style={{ color: "#177D52" }}>
                → Transform your leadership pipeline today. Our consultants
                design competency frameworks that drive measurable performance
                improvements.
              </div>
            </div>
          </div>
        </div>

        {/* Theme 3 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-4"
              style={{ backgroundColor: "#FF6B00" }}
            >
              3
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                Total Rewards & EVP for Sustainable Growth
              </h3>
              <p className="text-gray-600">
                Delivering fair, competitive and holistic rewards that attract,
                retain and motivate talent in tight markets.
              </p>
            </div>
          </div>

          <div className="mb-4 p-4 bg-gray-50 rounded-md">
            <h4 className="font-medium text-gray-800 mb-2">
              Aligned Korn Ferry Service Lines
            </h4>
            <p className="text-sm text-gray-700">
              Total Rewards Consulting, KF Pay analytics
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">
                Cross-persona evidence
              </h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>
                  • Rewards leaders battle a{" "}
                  <strong>34-point pay-fairness satisfaction gap</strong>{" "}
                  between executives and ICs.
                </li>
                <li>
                  • <strong>37% of women vs 27% of men</strong> feel overlooked
                  for raises.
                </li>
                <li>
                  • Pay is the <strong>#1 reason to leave</strong> for 80% of
                  job-switchers.
                </li>
                <li>
                  • CEOs link a <strong>16-point drop</strong> in perceived
                  fairness directly to retention risk.
                </li>
                <li>
                  • TA leaders stress compensation as{" "}
                  <strong>top attraction driver</strong> amid talent shortages.
                </li>
                <li>
                  • 87% of sales reps rank comp & growth as decisive for
                  staying.
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-800 mb-2">
                Business risk & opportunity
              </h4>
              <p className="text-sm text-gray-700">
                Opaque or inconsistent rewards erode trust and inflate churn
                costs.{" "}
                <strong>Data-rich, market-responsive reward designs</strong>{" "}
                reinforce EVP, engagement and margin.
              </p>
            </div>

            <div
              className="p-4 rounded-lg border-l-4"
              style={{
                backgroundColor: "rgba(255, 107, 0, 0.05)",
                borderColor: "#FF6B00",
              }}
            >
              <h4 className="font-medium mb-2" style={{ color: "#FF6B00" }}>
                🎯 How Korn Ferry Delivers Results
              </h4>
              <p className="text-sm text-gray-700 mb-3">
                <strong>KF Pay analytics</strong> provides global benchmarks and
                equity diagnostics across 150+ markets.{" "}
                <strong>Total Rewards Consulting</strong> designs comprehensive
                reward strategies that balance competitiveness, fairness, and
                cost control to drive retention and performance.
              </p>
              <div className="text-xs font-medium" style={{ color: "#FF6B00" }}>
                → Eliminate pay equity gaps and boost retention. Our consultants
                audit your current rewards and design market-leading
                compensation strategies.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMatrix = () => (
    <div className="space-y-8">
      {themeData.map((theme, index) => (
        <div
          key={theme.id}
          className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold mr-3 text-sm"
              style={{ backgroundColor: theme.color }}
            >
              {theme.id}
            </div>
            {theme.title}
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Persona
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Working Title
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Anchored KF Offer
                  </th>
                </tr>
              </thead>
              <tbody>
                {articleMatrix[
                  `theme${theme.id}` as keyof typeof articleMatrix
                ].map((article, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-800">
                      {article.persona}
                    </td>
                    <td className="py-3 px-4 text-gray-700 italic">
                      {article.title}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{article.offer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );

  const renderReferences = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="font-semibold text-lg mb-4" style={{ color: "#0E4230" }}>
          Internal Persona Files
        </h3>
        <ul className="space-y-2 text-gray-700">
          <li>
            •{" "}
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
              ceo_v3.json
            </code>
          </li>
          <li>
            •{" "}
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
              chro_v3.json
            </code>
          </li>
          <li>
            •{" "}
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
              talent_v3.json
            </code>
          </li>
          <li>
            •{" "}
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
              rewards_v3.json
            </code>
          </li>
          <li>
            •{" "}
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
              sales_v3.json
            </code>
          </li>
          <li>
            •{" "}
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
              leadership_dev_v3.json
            </code>
          </li>
        </ul>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="font-semibold text-lg mb-4" style={{ color: "#0E4230" }}>
          Additional Research & Market Signals
        </h3>
        <ul className="space-y-2 text-gray-700">
          <li>• Korn Ferry global pulse surveys (2024–2025)</li>
          <li>• Futurum Group CEO–AI Readiness Report 2025</li>
          <li>
            • Harvard Business Publishing – Leadership Development Priorities
            2024
          </li>
          <li>• Betterworks Coaching Impact Review 2023</li>
        </ul>
      </div>

      <div className="text-center text-gray-500 text-sm mt-8">
        © 2025 Korn Ferry. All rights reserved.
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "themes":
        return renderThemes();
      case "matrix":
        return renderMatrix();
      case "references":
        return renderReferences();
      default:
        return renderThemes();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading content...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white p-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Korn Ferry Cross-Persona Content Plan
        </h1>
        <p className="text-gray-600">
          Updated: 25 May 2025 | DEI-Neutral Version
        </p>
        <p className="text-gray-500 text-sm">
          18-piece persona-specific content programme | Version 1.0
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex flex-wrap">
          {sections.map((section) => {
            const IconComponent = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-3 text-sm font-medium transition-colors duration-200 whitespace-nowrap flex items-center space-x-2 ${
                  activeSection === section.id
                    ? "border-b-2"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
                style={{
                  ...(activeSection === section.id
                    ? { color: "#177D52", borderColor: "#177D52" }
                    : {}),
                }}
              >
                <IconComponent size={16} />
                <span>{section.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto py-6 pr-6 pl-3">
        {renderContent()}
      </div>
    </div>
  );
};

export default ContentPage;

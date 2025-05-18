"use client";

import React from "react";
import {
  Persona,
  isGlobalPersona,
  isCountryPersona,
} from "../../types/personas"; // Adjusted import path
import { Target, AlertTriangle, Activity, Users, Globe } from "lucide-react";

// Component to display detailed persona content
const PersonaDetailsContent = ({ persona }: { persona: Persona }) => {
  return (
    <>
      {isGlobalPersona(persona) ? (
        <>
          <div className="mb-8">
            <h3 className="section-title mb-3">
              <Target className="section-icon" />
              Goal Statement
            </h3>
            <p className="section-content">{persona.goalStatement}</p>
          </div>

          {/* Core Belief section */}
          {persona.coreBelief && (
            <div className="mb-8">
              <h3 className="section-title mb-3">
                <Target className="section-icon" />
                Core Belief
              </h3>
              <p className="section-content">{persona.coreBelief}</p>
            </div>
          )}
          {persona.keyResponsibilities &&
            persona.keyResponsibilities.length > 0 && (
              <div className="mb-8">
                <h3 className="section-title mb-3">
                  <Activity className="section-icon" />
                  Key Responsibilities
                </h3>
                <ul className="list-disc pl-8 section-content space-y-2">
                  {persona.keyResponsibilities.map((resp, index) => (
                    <li key={index}>{resp}</li>
                  ))}
                </ul>
              </div>
            )}
          {persona.knowledgeOrExpertise &&
            persona.knowledgeOrExpertise.length > 0 && (
              <div className="mb-8">
                <h3 className="section-title mb-3">
                  <Users className="section-icon" /> Knowledge/Expertise
                </h3>
                <ul className="list-disc pl-8 section-content space-y-2">
                  {persona.knowledgeOrExpertise.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          {persona.typicalChallenges &&
            persona.typicalChallenges.length > 0 && (
              <div className="mb-8">
                <h3 className="section-title mb-3">
                  <AlertTriangle className="section-icon" /> Typical Challenges
                </h3>
                <ul className="list-disc pl-8 section-content space-y-2">
                  {persona.typicalChallenges.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          {persona.currentProjects && persona.currentProjects.length > 0 && (
            <div className="mb-8">
              <h3 className="section-title mb-3">
                <Activity className="section-icon" />
                Current Projects
              </h3>
              <ul className="list-disc pl-8 section-content space-y-2">
                {persona.currentProjects.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          {persona.painPoints && persona.painPoints.length > 0 && (
            <div className="mb-8">
              <h3 className="section-title mb-3">
                <AlertTriangle className="section-icon" />
                Pain Points (Global)
              </h3>
              <ul className="list-disc pl-8 section-content space-y-2">
                {persona.painPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          )}
          {persona.behaviors && persona.behaviors.length > 0 && (
            <div className="mb-8">
              <h3 className="section-title mb-3">
                <Activity className="section-icon" />
                Behaviors (Global)
              </h3>
              <ul className="list-disc pl-8 section-content space-y-2">
                {persona.behaviors.map((behavior, index) => (
                  <li key={index}>{behavior}</li>
                ))}
              </ul>
            </div>
          )}
          {persona.collaborationInsights &&
            persona.collaborationInsights.length > 0 && (
              <div className="mb-8">
                <h3 className="section-title mb-3">
                  <Users className="section-icon" />
                  Collaboration Insights (Global)
                </h3>
                <ul className="list-disc pl-8 section-content space-y-2">
                  {persona.collaborationInsights.map((insight, index) => (
                    <li key={index}>{insight}</li>
                  ))}
                </ul>
              </div>
            )}
          {persona.emotionalTriggers &&
            persona.emotionalTriggers.raw &&
            persona.emotionalTriggers.raw.length > 0 && (
              <div className="mb-8">
                <h3 className="section-title mb-3">
                  <AlertTriangle className="section-icon" />
                  Emotional Triggers
                </h3>
                <ul className="list-disc pl-8 section-content space-y-2">
                  {persona.emotionalTriggers.raw.map(
                    (trigger: any, index: number) => (
                      <li key={index}>
                        <strong>{trigger.Trigger || "Trigger"}</strong>:{" "}
                        {trigger.Emotional_Response || trigger.Response || ""}
                        {trigger.Messaging_Implication && (
                          <div className="text-sm ml-4 mt-1 text-gray-600">
                            <em>Messaging: {trigger.Messaging_Implication}</em>
                          </div>
                        )}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          {persona.quote && (
            <div className="mb-8">
              <h3 className="section-title mb-3">
                <Target className="section-icon" />
                Quote
              </h3>
              <p className="section-content italic">
                &ldquo;{persona.quote}&rdquo;
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="mb-8">
            <h3 className="section-title mb-3">
              <Target className="section-icon" />
              User Goal Statement
            </h3>
            <p className="section-content">{persona.userGoalStatement}</p>
          </div>

          {/* PAIN POINTS - COUNTRY PERSONA */}
          {isCountryPersona(persona) &&
          persona.painPoints &&
          typeof persona.painPoints === "object" &&
          !Array.isArray(persona.painPoints) &&
          Object.keys(persona.painPoints).length > 0 ? (
            <div className="mb-8">
              <h3 className="section-title mb-3">
                <AlertTriangle className="section-icon" />
                Pain Points
              </h3>
              <div className="section-content space-y-3">
                {Object.entries(persona.painPoints).map(
                  ([subHeading, points]) => (
                    <div key={subHeading}>
                      <h4 className="font-semibold text-gray-800 mb-1 text-sm">
                        {subHeading}
                      </h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        {points.map((point, index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )
                )}
              </div>
            </div>
          ) : isCountryPersona(persona) && // Fallback for string[] if necessary, though types suggest object
            persona.painPoints &&
            Array.isArray(persona.painPoints) &&
            persona.painPoints.length > 0 ? (
            <div className="mb-8">
              <h3 className="section-title mb-3">
                <AlertTriangle className="section-icon" />
                Pain Points
              </h3>
              <ul className="list-disc pl-8 section-content space-y-2">
                {persona.painPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* KEY RESPONSIBILITIES - COUNTRY PERSONA */}
          {isCountryPersona(persona) &&
          persona.keyResponsibilities &&
          typeof persona.keyResponsibilities === "object" &&
          !Array.isArray(persona.keyResponsibilities) &&
          Object.keys(persona.keyResponsibilities).length > 0 ? (
            <div className="mb-8">
              <h3 className="section-title mb-3">
                <Activity className="section-icon" />
                Key Responsibilities
              </h3>
              <div className="section-content space-y-3">
                {Object.entries(persona.keyResponsibilities).map(
                  ([subHeading, responsibilities]) => (
                    <div key={subHeading}>
                      <h4 className="font-semibold text-gray-800 mb-1 text-sm">
                        {subHeading}
                      </h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        {responsibilities.map((resp, index) => (
                          <li key={index}>{resp}</li>
                        ))}
                      </ul>
                    </div>
                  )
                )}
              </div>
            </div>
          ) : isCountryPersona(persona) && // Fallback for string[]
            persona.keyResponsibilities &&
            Array.isArray(persona.keyResponsibilities) &&
            persona.keyResponsibilities.length > 0 ? (
            <div className="mb-8">
              <h3 className="section-title mb-3">
                <Activity className="section-icon" />
                Key Responsibilities
              </h3>
              <ul className="list-disc pl-8 section-content space-y-2">
                {persona.keyResponsibilities.map((resp, index) => (
                  <li key={index}>{resp}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* NEEDS - COUNTRY PERSONA */}
          {isCountryPersona(persona) &&
          persona.needs &&
          typeof persona.needs === "object" &&
          !Array.isArray(persona.needs) &&
          Object.keys(persona.needs).length > 0 ? (
            <div className="mb-8">
              <h3 className="section-title mb-3">
                <Target className="section-icon" />
                Needs
              </h3>
              <div className="section-content space-y-3">
                {Object.entries(persona.needs).map(([subHeading, items]) => (
                  <div key={subHeading}>
                    <h4 className="font-semibold text-gray-800 mb-1 text-sm">
                      {subHeading}
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ) : isCountryPersona(persona) && // Fallback for string[]
            persona.needs &&
            Array.isArray(persona.needs) &&
            persona.needs.length > 0 ? (
            <div className="mb-8">
              <h3 className="section-title mb-3">
                <Target className="section-icon" />
                Needs
              </h3>
              <ul className="list-disc pl-8 section-content space-y-2">
                {persona.needs.map((need, index) => (
                  <li key={index}>{need}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* MOTIVATIONS - COUNTRY PERSONA */}
          {isCountryPersona(persona) &&
          persona.motivations &&
          typeof persona.motivations === "object" &&
          !Array.isArray(persona.motivations) &&
          Object.keys(persona.motivations).length > 0 ? (
            <div className="mb-8">
              <h3 className="section-title mb-3">
                <Activity className="section-icon" />
                Motivations
              </h3>
              <div className="section-content space-y-3">
                {Object.entries(persona.motivations).map(
                  ([subHeading, items]) => (
                    <div key={subHeading}>
                      <h4 className="font-semibold text-gray-800 mb-1 text-sm">
                        {subHeading}
                      </h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        {items.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )
                )}
              </div>
            </div>
          ) : isCountryPersona(persona) && // Fallback for string[]
            persona.motivations &&
            Array.isArray(persona.motivations) &&
            persona.motivations.length > 0 ? (
            <div className="mb-8">
              <h3 className="section-title mb-3">
                <Activity className="section-icon" />
                Motivations
              </h3>
              <ul className="list-disc pl-8 section-content space-y-2">
                {persona.motivations.map((motivation, index) => (
                  <li key={index}>{motivation}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* BEHAVIORS - COUNTRY PERSONA */}
          {isCountryPersona(persona) &&
          persona.behaviors &&
          typeof persona.behaviors === "object" &&
          !Array.isArray(persona.behaviors) &&
          Object.keys(persona.behaviors).length > 0 ? (
            <div className="mb-8">
              <h3 className="section-title mb-3">
                <Activity className="section-icon" />
                Behaviors
              </h3>
              <div className="section-content space-y-3">
                {Object.entries(persona.behaviors).map(
                  ([subHeading, items]) => (
                    <div key={subHeading}>
                      <h4 className="font-semibold text-gray-800 mb-1 text-sm">
                        {subHeading}
                      </h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        {items.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )
                )}
              </div>
            </div>
          ) : isCountryPersona(persona) && // Fallback for string[]
            persona.behaviors &&
            Array.isArray(persona.behaviors) &&
            persona.behaviors.length > 0 ? (
            <div className="mb-8">
              <h3 className="section-title mb-3">
                <Activity className="section-icon" />
                Behaviors
              </h3>
              <ul className="list-disc pl-8 section-content space-y-2">
                {persona.behaviors.map((behavior, index) => (
                  <li key={index}>{behavior}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* COLLABORATION INSIGHTS - COUNTRY PERSONA */}
          {isCountryPersona(persona) &&
          persona.collaborationInsights &&
          typeof persona.collaborationInsights === "object" &&
          !Array.isArray(persona.collaborationInsights) &&
          Object.keys(persona.collaborationInsights).length > 0 ? (
            <div className="mb-8">
              <h3 className="section-title mb-3">
                <Users className="section-icon" />
                Collaboration Insights
              </h3>
              <div className="section-content space-y-3">
                {Object.entries(persona.collaborationInsights).map(
                  ([subHeading, insights]) => (
                    <div key={subHeading}>
                      <h4 className="font-semibold text-gray-800 mb-1 text-sm">
                        {subHeading}
                      </h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        {insights.map((insight, index) => (
                          <li key={index}>{insight}</li>
                        ))}
                      </ul>
                    </div>
                  )
                )}
              </div>
            </div>
          ) : isCountryPersona(persona) && // Fallback for string[]
            persona.collaborationInsights &&
            Array.isArray(persona.collaborationInsights) &&
            persona.collaborationInsights.length > 0 ? (
            <div className="mb-8">
              <h3 className="section-title mb-3">
                <Users className="section-icon" />
                Collaboration Insights
              </h3>
              <ul className="list-disc pl-8 section-content space-y-2">
                {persona.collaborationInsights.map((insight, index) => (
                  <li key={index}>{insight}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {isCountryPersona(persona) &&
            persona.regionalNuances &&
            persona.regionalNuances.length > 0 && (
              <div className="mb-8">
                <h3 className="section-title mb-3">
                  <Globe className="section-icon" />
                  Regional Nuances
                </h3>
                <ul className="list-disc pl-8 section-content space-y-2">
                  {persona.regionalNuances.map((nuance, index) => (
                    <li key={index}>{nuance}</li>
                  ))}
                </ul>
              </div>
            )}

          {isCountryPersona(persona) && persona.culturalContext && (
            <div className="mb-8">
              <h3 className="section-title mb-3">
                <Globe className="section-icon" />
                Cultural Context
              </h3>
              <p className="section-content">{persona.culturalContext}</p>
            </div>
          )}

          {persona.emotionalTriggers &&
            persona.emotionalTriggers.raw &&
            persona.emotionalTriggers.raw.length > 0 && (
              <div className="mb-8">
                <h3 className="section-title mb-3">
                  <AlertTriangle className="section-icon" />
                  Emotional Triggers
                </h3>
                <ul className="list-disc pl-8 section-content space-y-2">
                  {persona.emotionalTriggers.raw.map(
                    (trigger: any, index: number) => (
                      <li key={index}>
                        <strong>{trigger.Trigger || "Trigger"}</strong>:{" "}
                        {trigger.Emotional_Response || trigger.Response || ""}
                        {trigger.Messaging_Implication && (
                          <div className="text-sm ml-4 mt-1 text-gray-600">
                            <em>Messaging: {trigger.Messaging_Implication}</em>
                          </div>
                        )}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          {persona.quote && (
            <div className="mb-8">
              <h3 className="section-title mb-3">
                <Target className="section-icon" />
                Quote
              </h3>
              <p className="section-content italic">
                &ldquo;{persona.quote}&rdquo;
              </p>
            </div>
          )}

          {/* ADDED: Render presentation field if it exists */}
          {isCountryPersona(persona) && persona.presentation && (
            <div className="mb-8">
              <h3 className="section-title mb-3">
                {/* Using a generic icon for now */}
                <Activity className="section-icon" />
                Presentation Guidance
              </h3>
              <pre className="section-content bg-gray-100 p-2 rounded text-sm whitespace-pre-wrap">
                {typeof persona.presentation === "string"
                  ? persona.presentation
                  : JSON.stringify(persona.presentation, null, 2)}
              </pre>
            </div>
          )}

          {/* ADDED: Render comparison field if it exists */}
          {isCountryPersona(persona) &&
            persona.comparison &&
            Array.isArray(persona.comparison) &&
            persona.comparison.length > 0 && (
              <div className="mb-8">
                <h3 className="section-title mb-3">
                  {/* Using a generic icon for now */}
                  <Users className="section-icon" />
                  Comparison Data
                </h3>
                <pre className="section-content bg-gray-100 p-2 rounded text-sm whitespace-pre-wrap">
                  {JSON.stringify(persona.comparison, null, 2)}
                </pre>
              </div>
            )}
        </>
      )}
    </>
  );
};

export default PersonaDetailsContent;

/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: analysisresults
 * Interface for AnalysisResults
 */
export interface AnalysisResults {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  analysisId?: string;
  /** @wixFieldType image */
  fruitImage?: string;
  /** @wixFieldType text */
  fruitType?: string;
  /** @wixFieldType text */
  qualityAssessment?: string;
  /** @wixFieldType number */
  confidenceScore?: number;
  /** @wixFieldType datetime */
  analysisDate?: Date | string;
  /** @wixFieldType boolean */
  isDefective?: boolean;
}


/**
 * Collection ID: resultsuggestions
 * Interface for ResultSuggestions
 */
export interface ResultSuggestions {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  suggestionTitle?: string;
  /** @wixFieldType text */
  qualityLevel?: string;
  /** @wixFieldType text */
  recommendationText?: string;
  /** @wixFieldType url */
  actionUrl?: string;
  /** @wixFieldType number */
  priorityOrder?: number;
  /** @wixFieldType text */
  applicableFruitType?: string;
}


/**
 * Collection ID: systemsteps
 * Interface for SystemSteps
 */
export interface SystemSteps {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  stepTitle?: string;
  /** @wixFieldType text */
  stepDescription?: string;
  /** @wixFieldType image */
  stepIcon?: string;
  /** @wixFieldType number */
  stepOrder?: number;
  /** @wixFieldType boolean */
  isActive?: boolean;
  /** @wixFieldType text */
  callToActionText?: string;
  /** @wixFieldType url */
  callToActionUrl?: string;
}


/**
 * Collection ID: usageinstructions
 * Interface for UsageInstructions
 */
export interface UsageInstructions {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  instructionTitle?: string;
  /** @wixFieldType text */
  instructionCategory?: string;
  /** @wixFieldType text */
  shortSummary?: string;
  /** @wixFieldType text */
  detailedContent?: string;
  /** @wixFieldType image */
  visualAid?: string;
  /** @wixFieldType url */
  relatedLink?: string;
  /** @wixFieldType date */
  lastRevisionDate?: Date | string;
}

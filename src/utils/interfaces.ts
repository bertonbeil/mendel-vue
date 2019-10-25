import { Project } from '@/utils/interfaces'

export interface DialogBase {
  component?: string;
  title?: string;
  debug?: string;
  dialogIntro?: string;
  dialogInfo?: string;
  submenuTitle?: string;
  items?: DialogBase[];
  submitUrl?: string;
  saveAndNext?: string;
  saveAndNextData?: string | any;
}

export interface MainMenu{
  menuTitle: string;
  disabled: boolean;
  items: DialogBase[]
}

export interface Study {
  name?: string
  description?: string
}

export interface Project {
  study?: string
  name?: string
  description?: string
}

export interface DenovoCDS {
  study?: string
  project?: string
  organism?: string
  suffix?: string
  accession?: string
  dna_sequence?: string
  forbiddenRegions?: string
  excludeRestrictionEnzymes?: boolean
  excludeForbiddenRegions?: boolean
  nickname?: string
}

export interface DenovoAssembly {
  studyName?: string
  projectName?: string
  name?: string
  description?: string
  pathway?: string
  organism?: string
  lox?: string
  closingAdapter?: string
  openReValue?: string
  closeReValue?: string
  parts: object[]
}

export interface DenovoSegment {
  studyName?: string
  projectName?: string
  dnaDesignName?: string
  assemblyVectorName?: string
  maxLen?: number
  minLen?: number
  optLen?: number
  overlap?: number
  restrictionEnzyme5?: string
  restrictionEnzyme3?: string
  loxPsymDistance?: number
  homopolymerLen?: number
  homopolymerDistance?: number
  sequences?: string
  type?: string
}

export interface DenovoPrimers {
  studyName?: string
  projectName?: string
  primers?: string
  dnaDesignName?: string
  minLength?: number
  maxLength?: number
  minTemperature?: number
  maxTemperature?: number
  minPercentGC?: number
  maxPercentGC?: number
  minDistance?: number
  maxDistance?: number
  saltConcentration?: number
  dnaConcentration?: number
  dimerLength?: number
  hairpinLength?: number
  tailMinDistance?: number
  well?: string
}

export interface AdaptoRegionOfInterest {
  studyName?: string,
  projectName?: string,
  name?: string,
  description?: string,
  organism?: string,
  chromosome?: string,
  openPos?: number,
  closePos?: number,
  length?: number,
  source?: object
}

export interface AdaptoAssembly {
  studyName?: string
  projectName?: string
  locusName?: string
  name?: string
  description?: string
}

export interface AdaptoSegmentRequest {
  studyName?: string
  projectName?: string
  assemblyVectorName?: string
  dnaDesignName?: string
  assembly?: string
  mask?: string
  maxLen?: number
  minLen?: number
  optLen?: number
  minOverlap?: number
  maxOverlap?: number
  optOverlap?: number
  sequences?: string
  firstSegmentIdx?: number | null
  lastSegmentIdx?: number | null
}

export interface AdaptoSegmentsManipulation {
  requestType?: string,
  action?: string,
  segment_request?: object,
  primers_request?: object
}

export interface AdaptoSegmentsManipulationSegmentRequest {
  studyName?: string,
  projectName?: string,
  dnaDesignName?: string,
  firstSegmentIdx?: number | null,
  lastSegmentIdx?: number | null,
  newName?: string,
  customSegments?: any
}

export interface AdaptoSegmentsManipulationPrimersRequest {
  studyName?: string,
  projectName?: string,
  dnaDesignName?: string,
  primers?: string,
  minTemperature?: number,
  maxTemperature?: number,
  saltConcentration?: number,
  dnaConcentration?: number,
  minPercentGC?: number,
  maxPercentGC?: number,
  minLength?: number,
  maxLength?: number,
  minDistance?: number,
  maxDistance?: number,
  dimerLength?: number,
  hairpinLength?:number,
  tailMinDistance?: number,
  type?: string,
  well?: string
}

export interface AdaptoPrimersRequest {
  dnaDesignName?: string
  primers?: string
  minTemperature?: number
  maxTemperature?: number
  saltConcentration?: number
  dnaConcentration?: number
  minPercentGC?: number
  maxPercentGC?: number
  minLength?: number
  maxLength?: number
  minDistance?: number
  maxDistance?: number
  dimerLength?: number
  hairpinLength?: number
  tailMinDistance?: number
  type?: string
  well?: string
}

export interface AdaptoPrimers {
  studyName?: string
  projectName?: string
  primers?: string
  dnaDesignName?: string
  minLength?: number
  maxLength?: number
  minTemperature?: number
  maxTemperature?: number
  minPercentGC?: number
  maxPercentGC?: number
  minDistance?: number
  maxDistance?: number
  maxHomopolymerLen?: number
  minBaseRepresentation?: number
  hairpinLength?: number
  saltConcentration?: number
  dnaConcentration?: number
  dimerLength?: number
  tailMinDistance?: number
  well?: string
}

export interface ImportsCDS {
  study?: string
  project?: string
  organism?: string
  suffix?: string
  description?: string
  accession?: string,
  dna_sequence?: string,
  nickname?: string,
  forbiddenRegions?: string,
  excludeRestrictionEnzymes?: boolean,
  excludeForbiddenRegions?: boolean,
  source?: string
}

export interface importAssembly {
  studyName?: string
  projectName?: string
  name?: string,
  description?: string,
  pathway?: string,
  parts?: string,
}

export interface ImportsCustomParts {
  projectName?: string,
  action?: string,
  data?: string,
}

export interface ImportsSegments {
  study?: string,
  projectName?: string,
  dnaDesignName?: string,
  assembly?: string,
  maxLen?: number,
  minLen?: number,
  overlap?: number,
  loxPsymDistance?: number,
  homopolymerLen?: number,
  homopolymerDistance?: number,
  assemblyVectorName?: string,
  restrictionEnzyme5?: string,
  restrictionEnzyme3?: string,
  sequences?: string
}

export interface EchoFile {
  dna_amount?: number
  primer_amount?: number
  primer_control_location?: string
}

export interface EchoFileAssemblyRow {
  id: string,
  study: string,
  project: string,
  name: string,
  templates: number,
  segments: number,
  num_controls: number,
  location: string,
  negativeCtrl: boolean,
  positiveCtrl: boolean,
  waterCtrl: boolean,
  step?: string | number,
  primersLoc?: string,
  junctions: number[],
  wellsUsed?: number
}

export interface ExportAssembly {
  study?: string
  project?: string
  assemblyName?: string
}

export interface ToolAssemblyAlignments {
  studyName?: string,
  projectName?: string,
  assembly_name?: string
}
export interface ToolVisualizers {
  studyName?: string,
  projectName?: string,
  assembly_name?: string
};
export interface ToolPrimerCoverages {
  primers?: string,
  dnaDesignName?: string,
  minTemperature?: number,
  maxTemperature?: number,
  saltConcentration?: number,
  dnaConcentration?: number,
  minPercentGC?: number,
  maxPercentGC?: number,
  maxHomopolymerLen?: number,
  minBaseRepresentation?: number,
  maxHairpinLen?: number,
  minLength?: number,
  maxLength?: number,
  minDistance?: number,
  maxDistance?: number,
  dimerLength?: number,
  hairpinLength?: number,
  tailMinDistance?: number,
  type?: string,
  well?: string,
  source: object
}

export interface PrimerCoverageSource {
  organism?: string,
  chromosome?: string,
  openPosition?: string,
  closePosition?: string,
  leftPadding?: number,
  rightPadding?: number,
  sequence?: string
}

export interface ToolStudysCollaborators {
  studyName?: string,
}
export interface RegionPrimersTools {
  user?: string,
  requestType?: string,
  studyName?: string,
  projectName?: string,
  primers?: string,
  dnaDesignName?: string,
  minTemperature?: string,
  maxTemperature?: string,
  saltConcentration?: string,
  dnaConcentration?: string,
  minPercentGC?: string,
  maxPercentGC?: string,
  maxHomopolymerLen?: string,
  minBaseRepresentation?: string,
  maxHairpinLen?: string,
  minLength?: string,
  maxLength?: string,
  minDistance?: string,
  maxDistance?: string,
  dimerLength?: string,
  hairpinLength?: string,
  tailMinDistance?: string,
  type?: string,
  well?: string
}
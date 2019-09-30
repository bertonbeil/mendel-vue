import { Project } from '@/utils/interfaces'

export interface DialogBase {
  component?: string;
  title?: string;
  debug?: string;
  dialogCaption?: string;
  dialogIntro?: string;
  dialogInfo?: string;
  submenuTitle?: string;
  items?: DialogBase[];
  submitUrl?: string;
  saveAndNext?: string;
  saveAndNextData?: string | any;
}

export interface MainMenu {
  menuTitle: string;
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
  firstSegmentIdx?: number
  lastSegmentIdx?: number
}

export interface AdaptoSegmentsManipulation {
  studyName?: string
  projectName?: string
  assemblyName?: string
  action?: string
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
  study?: string
  projectName?: string
  name?: string,
  description?: string,
  pathway?: '',
  parts?: string,
}

export interface EchoFile {
  project?: string
  dna_amount?: number
  primer_amount?: number
  primer_control_location?: string
}

export interface ExportAssembly {
  study?: string
  project?: string
  assemblyName?: string
}
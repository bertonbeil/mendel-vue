import { Project } from '@/utils/interfaces';
export interface DialogBase {
  component?: string;
  title?: string;
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
  name?: string,
  description?: string
}

export interface Project {
  study?: string,
  name?: string,
  description?: string
}

export interface DenovoCDS {
  study?: string,
  project?: string,
  organism?: string,
  suffix?: string,
  accession?: string,
  dna_sequence?: string,
  forbiddenRegions?: string,
  excludeRestrictionEnzymes?: boolean,
  excludeForbiddenRegions?: boolean,
  nickname?: string
}

export interface DenovoAssembly {
  studyName?: string,
  projectName?: string,
  name?: string,
  description?: string,
  pathway?: string,
  organism?: string,
  lox?: string,
  closingAdapter?: string,
  openReValue?: string,
  closeReValue?: string,
  parts: object[]
}

export interface DenovoSegment {
  study?: string,
  project?: string,
  dnaDesignName?: string,
  assemblyVectorName?: string,
  maxLen?: number,
  minLen?: number,
  optLen?: number,
  overlap?: number,
  restrictionEnzyme5?: string,
  restrictionEnzyme3?: string,
  loxPsymDistance?: number,
  homopolymerLen?: number,
  homopolymerDistance?: number,
  sequences?: string
}

export interface DenovoPrimers {
  study?: string,
  project?: string,
  dnaDesignName?: string,
  minLength?: number,
  maxLength?: number,
  minTemperature?: number,
  maxTemperature?: number,
  minPercentGC?: number,
  maxPercentGC?: number,
  minDistance?: number,
  maxDistance?: number,
  saltConcentration?: number,
  dnaConcentration?: number,
  dimerLength?: number,
  hairpinLength?: number,
  tailMinDistance?: number,
  well?: string,
  primers?: string
}
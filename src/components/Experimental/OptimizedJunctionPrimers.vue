<template>
  <div>
    <el-row :gutter="20" class="mb-20">
      <el-col :span="24">
        <h3 class="text-black font-bold">Optimized Junction Primers</h3>
      </el-col>
    </el-row>

    <el-form :model="OptimizedJunctionForm" label-position="top" :rules="rules" ref="OptimizedJunctionForm">
      <el-row :gutter="20" class="mb-30">
        <el-col :span="8">
            <el-form-item label="Study name:" prop="studyName">
              <el-select
                v-model="OptimizedJunctionForm.studyName"
                @change="getProjectsList"
                placeholder="Select study"
                class="w-full">
                <el-option v-for="item in studyList" :key="item.name" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Project name:" prop="projectName">
              <el-select
                v-model="OptimizedJunctionForm.projectName"
                :disabled="!OptimizedJunctionForm.studyName"
                @change="getAssemblyList"
                placeholder="Select project"
                class="w-full">
                <el-option v-for="item in projectsList" :key="item.name" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
          <el-form-item label="Assembly name:" prop="name">
            <el-select
              v-model="OptimizedJunctionForm.primers"
              filterable
              allow-create
              default-first-option
              placeholder="Select assembly"
              class="w-full"
              :disabled="!OptimizedJunctionForm.projectName">
              <el-option v-for="(item, index) in assemblyList" :key="index" :label="item.assembly" :value="item.assembly"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <div v-if="isShowDraggable">
        <el-row :gutter="20" class="mb-20">
          <el-col :span="6">
            <p class="text-xl text-black">Constarint Pallete</p>
          </el-col>
          <el-col :span="6">
            <p class="text-xl text-black">Requirement</p>
          </el-col>
          <el-col :span="6">
            <p class="text-xl text-black">Strong Preference</p>
          </el-col>
          <el-col :span="6">
            <p class="text-xl text-black">Soft Preference</p>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="optimazed-junction mb-20">
          <el-col :span="6">
            <draggable class="el-card is-never-shadow p-10 h-600" v-model="availableConstraints" :group="{ name: 'people', pull: 'clone', put: false }" :move="checkMove">
              <div class="inline-block w-full p-1 cursor-pointer" v-for="(constarint, index) in availableConstraints" :key="index">
                <el-card shadow="hover" body-style="padding:10px">
                  <div>
                    <div class="mb-5"> {{ constarint.name }} </div>
                  </div>
                </el-card>
              </div>
            </draggable>
          </el-col>
          <el-col :span="6">
            <draggable
              class="min-h-full el-card is-never-shadow p-10 h-600" v-model="requirements"
              :group="{ name: 'people', pull: true, put: true }"
              :move="checkMove"
              @add="onDrop('requirements')">
              <div class="inline-block w-full p-1 cursor-pointer" v-for="(requirement, index) in requirements" :key="index">
                <el-card shadow="hover" body-style="padding:10px">{{ requirement.name }}
                  <div v-if="requirement.min" class="flex justify-between pt-5">
                    <span>
                      <span>Min: </span>
                      <el-input-number size="mini" v-model="requirements[index].min"></el-input-number>
                    </span>
                    <span>
                      <span>Max: </span>
                      <el-input-number size="mini" v-model="requirements[index].max"></el-input-number>
                    </span>
                  </div>
                </el-card>
              </div>
            </draggable>
          </el-col>
          <el-col :span="6">
            <draggable
              class="min-h-full el-card is-never-shadow p-10 h-600"
              v-model="strongPreferences"
              :group="{ name: 'people', pull: true, put: true }"
              :move="checkMove"
              @add="onDrop('strongPreferences')">
              <div class="inline-block w-full p-1 cursor-pointer" v-for="(strongPreference, index) in strongPreferences" :key="index">
                <el-card shadow="hover" body-style="padding:10px">{{ strongPreference.name }}
                  <div v-if="strongPreference.min" class="flex justify-between pt-5">
                    <span>
                      <span>Min: </span>
                      <el-input-number class="max-w-xs" size="mini" v-model="strongPreferences[index].min"></el-input-number>
                    </span>
                    <span>
                      <span>Max: </span>
                      <el-input-number size="mini" v-model="strongPreferences[index].max"></el-input-number>
                    </span>
                  </div>
                </el-card>
              </div>
            </draggable>
          </el-col>
          <el-col :span="6">
            <draggable
              class="min-h-full el-card is-never-shadow p-10 h-600"
              v-model="softPreferences"
              :group="{ name: 'people', pull: true, put: true }"
              :move="checkMove"
              @add="onDrop('softPreferences')">
            <div class="inline-block w-full p-1 cursor-pointer" v-for="(softPreference, index) in softPreferences" :key="index">
              <el-card shadow="hover" body-style="padding:10px">{{ softPreference.name }}
                <div v-if="softPreference.min" class="flex justify-between pt-5">
                  <span>
                    <span>Min: </span>
                    <el-input-number size="mini" v-model="softPreferences[index].min"></el-input-number>
                  </span>
                  <span>
                    <span>Max: </span>
                    <el-input-number size="mini" v-model="softPreferences[index].max"></el-input-number>
                  </span>
                </div>
              </el-card>
            </div>
          </draggable>
          </el-col>
        </el-row>
      </div>
    </el-form>

    <!-- Modal action buttons -->
    <div slot="footer" class="text-center">
      <el-button type="danger" @click="$emit('close')">Cancel</el-button>
      <el-button type="success" @click="save">Save</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { httpService } from '@/services/http.service'
import { OptimizeJunctionPrimers } from '@/utils/interfaces'

@Component({ name: 'OptimizedJunctionPrimers' })

export default class OptimizedJunctionPrimers extends Vue {
  studyList: string[] = []
  projectsList: string[] = []
  assemblyList: string[] = []
  isShowDraggable: boolean = true
  requirements: object[] = []
  strongPreferences: object[] = []
  softPreferences: object[] = []
  availableConstraints: object[] = [
    {
      name: 'PrimerDiversityConstraint'
    },
    {
      name: 'PrimerUniqueConstraint'
    },
    {
      name: 'PrimerGCConstraint',
      min: 40,
      max: 60
    },
    {
      name: 'PrimerLengthConstraint',
      min: 22,
      max: 22
    },
    {
      name: 'PrimerLengthConstraint',
      min: 18,
      max: 26
    },
    {
      name: 'PrimerTemperatureConstraint',
      min: 48,
      max: 60
    },
    {
      name: 'PrimerHairpinConstraint'
    },
    {
      name: 'PrimerMaxPolimerRunConstraint'
    }
  ]

  onDrop (payload: any) {
    (this as any)[payload] = JSON.parse(JSON.stringify((this as any)[payload]))
  }

  OptimizedJunctionForm: OptimizeJunctionPrimers = {
    studyName: 'Sox2',
    projectName: 'Sox2Test',
    primers: '',
    dnaDesignName: 'Masked2',
    minTemperature: 52,
    maxTemperature: 58,
    saltConcentration: 0.05,
    dnaConcentration: 5,
    minPercentGC: 40,
    maxPercentGC: 60,
    minLength: 18,
    maxLength: 30,
    minDistance: 80,
    maxDistance: 300,
    dimerLength: 5,
    hairpinLength: 5,
    tailMinDistance: 200,
    well: 'A1',
    type: 'JunctionOptimized'
  }

  rules: object = {
    studyName: [ { required: true, message: 'Study name is required' } ],
    projectName: [ { required: true, message: 'Project name is required' } ],
    name: [ { required: true, message: 'Assembly name is required' } ]
  }

  $refs!: {
    OptimizedJunctionForm: HTMLFormElement
  }

  checkMove (env: any) {
    return !env.relatedContext.list.map((el: any) => el.name)
      .includes(env.draggedContext.element.name)
  }

  getProjectsList () {
    this.$emit('loadOn')
    return httpService.post('query/projectNameList', { study: this.OptimizedJunctionForm.studyName })
      .then((res: any) => {
        this.projectsList = res.data.rows
      })
      .catch((err: any) => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }

  getAssemblyList () {
    this.$emit('loadOn')
    return httpService.post('query/projectAssemblyList', {
      study: this.OptimizedJunctionForm.studyName,
      project: this.OptimizedJunctionForm.projectName
    }).then((res: any) => {
      this.assemblyList = res.data.rows
    })
      .catch((err: any) => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }

  /* load Modal data -> Get list of study */
  getStudyList () {
    this.$emit('loadOn')
    return httpService.get('query/studyNameList')
      .then((res: any) => { this.studyList = res.data.rows })
      .catch((err: any) => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }

  constraintsWithType () {
    return [
      ...this.requirements.map((i) => { return { ...i, type: 'requirements' } }),
      ...this.strongPreferences.map((i) => { return { ...i, type: 'strongPreference' } }),
      ...this.softPreferences.map((i) => { return { ...i, type: 'softPreferences' } })
    ]
  }

  get sendData () {
    return {
      ...this.OptimizedJunctionForm,
      constraints: this.constraintsWithType() }
  }

  /* submit Modal data */
  save (next?: string) {
    this.$refs['OptimizedJunctionForm'].validate((valid: boolean) => {
      if (valid) this.$emit('save', { data: this.sendData })
      else return false
    })
  }

  created () {
    this.getStudyList()
  }
}
</script>

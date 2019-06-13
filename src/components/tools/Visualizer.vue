<template>
  <div class="overflow-x-auto overflow-y-hidden text-center" v-if="isVisible">
    <div class="inline-block p-40">
      <div class="visualizer-chart relative flex h-px mt-40 mb-80 bg-black" id="visualizerChart" v-html="visualizerToAppend"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { httpService } from '@/services/http.service'

@Component({ name: 'Visualizer' })

export default class CreateStudy extends Vue {
  visualizerToAppend: string = ''
  isVisible: boolean = false

  vizualizer (denovoAssemblyForm: any) {
    httpService.post('query/assemblyVisualizer', denovoAssemblyForm)
      .then((res: any) => {
        this.isVisible = true
        this.visualizerToAppend = ''
        for (let i of res.data.lims_response.elements) {
          let color
          switch (i.color) {
            case '1': color = 'b1cdff'; break
            case '2': color = '4c78b1'; break
            case '3': color = 'bfdf8d'; break
            case '4': color = '6b9f3b'; break
            case '5': color = 'dd9897'; break
            case '6': color = 'c43834'; break
            case '7': color = 'e9be73'; break
            case '8': color = 'd77d41'; break
            case '9': color = 'c2b1d3'; break
            case '10': color = '603f96'; break
            case '11': color = 'fdfa9d'; break
            case '12': color = 'ecec77'; break
            case '13': color = '878787'; break
            case '14': color = '000000'; break
          }

          switch (i.element) {
            case 'brs':
              this.visualizerToAppend += `<span class="sbol-item"><svg viewBox="0 25 48 48" style="background-color:#ffffff00" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" x="0px" y="0px" width="48px" height="48px"><defs><style type="text/css"><![CDATA[path,circle {stroke:#000000;stroke-width: 3;stroke-linecap: round;stroke-linejoin: round;fill: none}]]></style></defs><path style="stroke:#${color}" d="M 19 37 L 22 37 L 22 63 L 19 63 "/><path style="stroke:#${color}" d="M 31 37 L 28 37 L 28 63 L 31  63 "/></svg><span class="sbol-label">${i.label}</span></span>`
              break

            case 'srs5':
              this.visualizerToAppend += `<span class="sbol-item"><svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" viewBox="0 0 44.999999 44.999998" version="1.1" xml:space="preserve" x="0px" y="0px" width="0.5in" height="0.5in" id="svg2" inkscape:version="0.91 r13725" sodipodi:docname="five-prime-sticky-restriction-site.svg"><metadata id="metadata12"><rdf:RDF><cc:Work rdf:about=""><dc:format>image/svg+xml</dc:format><dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" /><dc:title></dc:title></cc:Work></rdf:RDF></metadata><sodipodi:namedview pagecolor="#ffffff" bordercolor="#666666" borderopacity="1" objecttolerance="10" gridtolerance="10" guidetolerance="10" inkscape:pageopacity="0" inkscape:pageshadow="2" inkscape:window-width="965" inkscape:window-height="702" id="namedview10" showgrid="false" units="in" inkscape:zoom="9.44" inkscape:cx="25" inkscape:cy="20.338983" inkscape:window-x="0" inkscape:window-y="0" inkscape:window-maximized="0" inkscape:current-layer="svg2" /><defs id="defs4"><style type="text/css" id="style6"><![CDATA[path,circle {stroke:#000000;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;fill:none}]]></style></defs><path d="m 7.5,9.499998 0,13 30,0 0,13" id="path8" inkscape:connector-curvature="0" style="fill:none;stroke:#${color};stroke-width:3;stroke-linecap:round;stroke-linejoin:round"/></svg><span class="sbol-label">${i.label}</span></span>`
              break

            case 'srs3':
              this.visualizerToAppend += `<span class="sbol-item"><svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" viewBox="0 0 44.999998 44.999998" version="1.1" xml:space="preserve" x="0px" y="0px" width="0.5in" height="0.5in" id="svg2" inkscape:version="0.91 r13725" sodipodi:docname="three-prime-sticky-restriction-site.svg"><metadata id="metadata12"><rdf:RDF><cc:Work rdf:about=""><dc:format>image/svg+xml</dc:format><dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage"/><dc:title></dc:title></cc:Work></rdf:RDF></metadata><sodipodi:namedview pagecolor="#ffffff" bordercolor="#666666" borderopacity="1" objecttolerance="10" gridtolerance="10" guidetolerance="10" inkscape:pageopacity="0" inkscape:pageshadow="2" inkscape:window-width="640" inkscape:window-height="480" id="namedview10" showgrid="false" units="in" inkscape:zoom="2.36" inkscape:cx="25" inkscape:cy="50" inkscape:window-x="0" inkscape:window-y="0" inkscape:window-maximized="0" inkscape:current-layer="svg2" /><defs id="defs4"><style type="text/css" id="style6"><![CDATA[path,circle {stroke:#000000;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;fill:none}]]></style></defs><path d="m 37.499997,9.4999972 0,12.9999998 -29.9999997,0 0,13" id="path8" inkscape:connector-curvature="0" style="fill:none;stroke:#${color};stroke-width:3;stroke-linecap:round;stroke-linejoin:round"/></svg><span class="sbol-label">${i.label}</span></span>`
              break

            case 'cds':
              this.visualizerToAppend += `<span class="sbol-item"><svg ${i.direction === '>' ? "style='transform:rotateY(180deg)'" : null} xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" viewBox="0 0 44.999998 44.999998" version="1.1" xml:space="preserve" x="0px" y="0px" width="0.5in" height="0.5in" id="svg2" inkscape:version="0.91 r13725" sodipodi:docname="cds.svg" inkscape:export-filename="/Users/jakebeal/projects/SBOL/SBOLv-realizations/Glyphs/cds/cds-specification.png" inkscape:export-xdpi="300" inkscape:export-ydpi="300"><metadata id="metadata12"><rdf:RDF><cc:Work rdf:about=""><dc:format>image/svg+xml</dc:format><dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" /><dc:title></dc:title></cc:Work></rdf:RDF></metadata><sodipodi:namedview pagecolor="#ffffff" bordercolor="#666666" borderopacity="1" objecttolerance="10" gridtolerance="10" guidetolerance="10" inkscape:pageopacity="0" inkscape:pageshadow="2" inkscape:window-width="942" inkscape:window-height="693" id="namedview10" showgrid="false" units="in" inkscape:zoom="9.44" inkscape:cx="25" inkscape:cy="24.576271" inkscape:window-x="0" inkscape:window-y="0" inkscape:window-maximized="0" inkscape:current-layer="svg2" /><defs id="defs4"><style type="text/css" id="style6"><![CDATA[path,circle {stroke:#000000;stroke-width: 2;stroke-linecap: round;stroke-linejoin: round;fill: none}]]></style></defs><path d="m 5.2562231,33.900582 23.6111729,0 10.876433,-11.400584 -10.876433,-11.400585 -23.6111729,0 z" id="path8" inkscape:connector-curvature="0" style="fill:#${color};stroke:#000000;stroke-width:2;stroke-linecap:round;stroke-linejoin:round" sodipodi:nodetypes="cccccc"/></svg><span class="sbol-label sbol-label-cds">${i.label}</span></span>`
              break

            case 'p':
              this.visualizerToAppend += `<span class="${i.direction === '>' ? 'sbol-item bottom-promoter' : 'sbol-item top-promoter'}"><svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" viewBox="0 0 44.999998 44.999998" version="1.1" xml:space="preserve" x="0px" y="0px" width="0.5in" height="0.5in" id="svg2" inkscape:version="0.91 r13725" sodipodi:docname="promoter.svg"><metadata id="metadata14"><rdf:RDF><cc:Work rdf:about=""><dc:format>image/svg+xml</dc:format><dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" /><dc:title></dc:title></cc:Work></rdf:RDF></metadata><sodipodi:namedview pagecolor="#ffffff" bordercolor="#666666" borderopacity="1" objecttolerance="10" gridtolerance="10" guidetolerance="10" inkscape:pageopacity="0" inkscape:pageshadow="2" inkscape:window-width="945" inkscape:window-height="775" id="namedview12" showgrid="false" units="in" inkscape:zoom="13.350176" inkscape:cx="25" inkscape:cy="26.030279" inkscape:window-x="0" inkscape:window-y="0" inkscape:window-maximized="0" inkscape:current-layer="svg2" /><defs id="defs4"><style type="text/css" id="style6"><![CDATA[path,circle {stroke:#000000;stroke-width: 3;stroke-linecap: round;stroke-linejoin: round;fill: none}]]></style></defs><path d="m 29.000111,5.2464081 8.5,7.4999999 -8.5,7.3333" id="path8" inkscape:connector-curvature="0" style="fill:none;stroke:#000000;stroke-width:3;stroke-linecap:round;stroke-linejoin:round"/><path d="m 7.5001114,39.746408 0,-27 28.9999996,0" id="path10" inkscape:connector-curvature="0" style="fill:none;stroke:#${i.color};stroke-width:3;stroke-linecap:round;stroke-linejoin:round"/></svg><span class="sbol-label">${i.label}</span></span>`
              break

            case 't':
              this.visualizerToAppend += `<span class="${i.direction === '>' ? 'sbol-item bottom-terminator' : 'sbol-item top-terminator'}"><svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" viewBox="0 0 44.999998 44.999998" version="1.1" xml:space="preserve" x="0px" y="0px" width="0.5in" height="0.5in" id="svg2" inkscape:version="0.91 r13725" sodipodi:docname="terminator.svg"><metadata id="metadata14"><rdf:RDF><cc:Work rdf:about=""><dc:format>image/svg+xml</dc:format><dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" /><dc:title></dc:title></cc:Work></rdf:RDF></metadata><sodipodi:namedview pagecolor="#ffffff" bordercolor="#666666" borderopacity="1" objecttolerance="10" gridtolerance="10" guidetolerance="10" inkscape:pageopacity="0" inkscape:pageshadow="2" inkscape:window-width="1008" inkscape:window-height="746" id="namedview12" showgrid="false" units="in" inkscape:zoom="13.350176" inkscape:cx="25" inkscape:cy="23.034063" inkscape:window-x="0" inkscape:window-y="0" inkscape:window-maximized="0" inkscape:current-layer="svg2" /><defs id="defs4"><style type="text/css" id="style6"><![CDATA[path,circle {stroke:#000000;stroke-width: 3;stroke-linecap: round;stroke-linejoin: round;fill: none}]]></style></defs><path d="m 22.499997,34.989391 0,-24.000001" id="path8" inkscape:connector-curvature="0" style="fill:none;stroke:#000000;stroke-width:3;stroke-linecap:round;stroke-linejoin:round" /><path d="m 7.4999973,9.9893904 29.9999997,0" id="path10" inkscape:connector-curvature="0" style="fill:none;stroke:#${i.color};stroke-width:3;stroke-linecap:round;stroke-linejoin:round" /></svg><span class="sbol-label">${i.label}</span></span>`
              break

            case 'rs':
              this.visualizerToAppend += `<span class="sbol-item"><svg ${i.direction === '>' ? "style='transform:rotateY(180deg)'" : null} xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" viewBox="0 0 44.999998 44.999998" version="1.1" xml:space="preserve" x="0px" y="0px" width="0.5in" height="0.5in" id="svg2" inkscape:version="0.91 r13725" sodipodi:docname="specific-recombination-site.svg" inkscape:export-filename="/Users/jakebeal/projects/SBOL/SBOLv-realizations/Glyphs/inverter/inverter-specification.png" inkscape:export-xdpi="300" inkscape:export-ydpi="300"><metadata id="metadata12"><rdf:RDF><cc:Work rdf:about=""><dc:format>image/svg+xml</dc:format><dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" /><dc:title></dc:title></cc:Work></rdf:RDF></metadata><sodipodi:namedview pagecolor="#ffffff" bordercolor="#666666" borderopacity="1" objecttolerance="10" gridtolerance="10" guidetolerance="10" inkscape:pageopacity="0" inkscape:pageshadow="2" inkscape:window-width="922" inkscape:window-height="720" id="namedview10" showgrid="false" units="in" inkscape:zoom="13.350176" inkscape:cx="25" inkscape:cy="26.030279" inkscape:window-x="0" inkscape:window-y="0" inkscape:window-maximized="0" inkscape:current-layer="svg2" /><defs id="defs4"><style type="text/css" id="style6"><![CDATA[path,circle {stroke:#000000;stroke-width: 2;stroke-linecap: round;stroke-linejoin: round;fill: none}]]></style></defs><path d="m 12.50009,32.499997 20,-10 -20,-10 0,20 z" id="path8" inkscape:connector-curvature="0" style="fill:#${color};stroke:#000000;stroke-width:2;stroke-linecap:round;stroke-linejoin:round" /></svg><span class="sbol-label">${i.label}</span></span>`
              break

            case 'er':
              this.visualizerToAppend += `<span class="sbol-item"><svg ${i.direction === '>' ? "style='transform:rotateY(180deg)'" : null} xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" viewBox="0 0 44.999998 44.999998" version="1.1" xml:space="preserve" x="0px" y="0px" width="0.5in" height="0.5in" id="svg2" inkscape:version="0.91 r13725" sodipodi:docname="user-defined.svg"><metadata id="metadata12"><rdf:RDF><cc:Work rdf:about=""><dc:format>image/svg+xml</dc:format><dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" /><dc:title>< dc:title></cc:Work></rdf:RDF></metadata><sodipodi:namedview pagecolor="#ffffff" bordercolor="#666666" borderopacity="1" objecttolerance="10" gridtolerance="10" guidetolerance="10" inkscape:pageopacity="0" inkscape:pageshadow="2" inkscape:window-width="640" inkscape:window-height="480" id="namedview10" showgrid="false" units="in" inkscape:zoom="2.36" inkscape:cx="25" inkscape:cy="50" inkscape:window-x="0" inkscape:window-y="0" inkscape:window-maximized="0" inkscape:current-layer="svg2" /><defs id="defs4"><style type="text/css" id="style6"><![CDATA[path,circle,polygon {stroke:#000000;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;fill:none}]]></style></defs><path d="m 2.4999973,12.499997 0,20 39.9999997,0 0,-20 z" id="path8" inkscape:connector-curvature="0" style="fill:#${color};stroke:#000000;stroke-width:2;stroke-linecap:round;stroke-linejoin:round" /></svg><span class="sbol-label">${i.label}</span></span>`
              break
          }
        }
        this.visualizerToAppend += '<div class="chaing-closet"></div>'
      })
  }
}
</script>

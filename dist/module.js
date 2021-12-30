(()=>{"use strict";class t{constructor(){this.generateSectorCoordinates=!0,this.generateNotesForAllEntities=!1,this.onlyGMJournals=!0}}class e extends FormApplication{constructor(t){super(),this.importer=t}static get defaultOptions(){const t=super.defaultOptions;return mergeObject(t,{popOut:!0,minimizable:!0,resizable:!0,height:"auto",id:"swn-importer-dialog",template:"modules/swn-importer/templates/dialog.html",title:"Import Sector Without Numbers sector",editable:!0})}getData(){return new t}_updateObject(t,e){const n=this.getFileUrl();return e&&n?this.close().then((t=>this.importer.importFile(n,e))):Promise.resolve()}getFileUrl(){var t;const e=$("#swn-sector-file")[0];return(null===(t=e.files)||void 0===t?void 0:t.length)?URL.createObjectURL(e.files.item(0)):null}}class n{static getLabel(t){return game.i18n.localize(this.LOCALIZATION_NAMESPACE+"."+t)}static formatLabel(t,e){return game.i18n.format(this.LOCALIZATION_NAMESPACE+"."+t,e)}static getEntityFlags(t){const e={};return e[this.MODULE_ID+".id"]=t.id,e[this.MODULE_ID+".type"]=t.type,e}static getAsList(t){return t?t instanceof Array?t:[t]:[]}static filterByTagId(t,e){return t.filter((t=>t.getFlag(this.MODULE_ID,"id")===e))}static forEachEntityType(t,e,n){let r;switch(e){case"all":r=["asteroidBase","asteroidBelt","blackHole","deepSpaceStation","gasGiantMine","moon","moonBase","orbitalRuin","planet","refuelingStation","researchBase","sector","spaceStation","system"];break;case"only-basic":r=["asteroidBase","asteroidBelt","deepSpaceStation","gasGiantMine","moon","moonBase","orbitalRuin","planet","refuelingStation","researchBase","spaceStation"];break;case"only-systems":r=["blackHole","system"]}r.forEach((e=>{const r=t[e];n(e,r)}))}static forEachEntity(t,e,n){this.forEachEntityType(t,e,((t,e)=>{e.forEach(((e,r,a)=>{n(r,e,t)}))}))}static getSectorCoordinates(t,e){return(t<10?"0"+t:t.toString())+(e<10?"0"+e:e.toString())}static getImagePath(t){return`modules/${this.MODULE_ID}/images/${t}`}static getTemplatePath(t){return`modules/${this.MODULE_ID}/templates/${t}`}static getMapValues(t){const e=[];return t.forEach(((t,n,r)=>{e.push(t)})),e}}n.MODULE_ID="swn-importer",n.LOCALIZATION_NAMESPACE="SWN-IMPORTER";const r=2*7500**.5,a=r/2,s=.55*100;class o{constructor(){this.options=new t,this.dialog=new e(this)}removeExistingData(){var t,e,n,r;(null===(t=game.user)||void 0===t?void 0:t.isGM)&&(null===(e=game.folders)||void 0===e||e.forEach((t=>t.delete())),null===(n=game.journal)||void 0===n||n.forEach((t=>t.delete())),null===(r=game.scenes)||void 0===r||r.forEach((t=>t.delete())))}initUI(t){var e;if(null===(e=game.user)||void 0===e?void 0:e.isGM){const e=`\n                <button id='swn-import-button' title='${n.getLabel("IMPORT-BUTTON-TOOLTIP")}'>\n                    <i class='fas fa-cloud-download-alt'></i>\n                    ${n.getLabel("IMPORT-BUTTON-NAME")}\n                </button>\n            `;t.find(".header-actions").append(e),t.on("click","#swn-import-button",(t=>this.openImportDialog()))}}openImportDialog(){this.dialog.render(!0)}importFile(t,e){var r;return this.options=e,(null===(r=game.user)||void 0===r?void 0:r.isGM)?fetch(t).then((t=>t.json())).then((t=>{const e={asteroidBase:new Map(Object.entries(t.asteroidBase)),asteroidBelt:new Map(Object.entries(t.asteroidBelt)),blackHole:new Map(Object.entries(t.blackHole)),deepSpaceStation:new Map(Object.entries(t.deepSpaceStation)),gasGiantMine:new Map(Object.entries(t.gasGiantMine)),moon:new Map(Object.entries(t.moon)),moonBase:new Map(Object.entries(t.moonBase)),note:null,orbitalRuin:new Map(Object.entries(t.orbitalRuin)),planet:new Map(Object.entries(t.planet)),refuelingStation:new Map(Object.entries(t.refuelingStation)),researchBase:new Map(Object.entries(t.researchBase)),sector:new Map(Object.entries(t.sector)),spaceStation:new Map(Object.entries(t.spaceStation)),system:new Map(Object.entries(t.system))};return n.forEachEntity(e,"all",((t,e,n)=>{e.id=t,e.type=n})),this.processSector(e)})).then((t=>{var e,r;return new Dialog({title:n.getLabel("RESULT-DIALOG-TITLE"),content:n.formatLabel("RESULT-DIALOG-CONTENT",{sectorName:null===(e=t.sectorData)||void 0===e?void 0:e.sector.values().next().value.name,journals:null===(r=t.entityJournals)||void 0===r?void 0:r.length}),buttons:{ok:{icon:'<i class="fas fa-check"></i>',label:n.getLabel("ACCEPT-BUTTON")}},default:"ok"}).render(!0),Promise.resolve()})):Promise.resolve()}preprocessEntity(t,e){t[e].forEach(((t,n,r)=>{t.id=n,t.type=e}))}processSector(t){const e={};return Promise.resolve(t).then((n=>(e.sectorData=n,e.groupedEntities=this.getGroupedEntities(t),this.createSectorJournalFolder(n)))).then((n=>(e.sectorJournalFolder=n,this.createSystemJournalFolders(t,n)))).then((n=>(e.systemJournalFolders=n,this.createJournals(t,e.sectorJournalFolder,n)))).then((n=>(e.entityJournals=n,this.createScene(t,n)))).then((t=>(e.scene=t,this.updateJournalContent(e.sectorData,e.groupedEntities,e.entityJournals)))).then((t=>Promise.resolve(e)))}updateJournalContent(t,e,n){const r=[];return e.forEach(((t,a,s)=>{t.forEach((t=>{r.push(this.getJournalUpdate(e,a,t.id,n))}))})),r.push(this.getSectorJournalUpdate(t,n)),Promise.all(r.filter((t=>null!=t))).then((t=>JournalEntry.updateDocuments(t)))}getSectorJournalUpdate(t,e){const r=[];n.forEachEntity(t,"only-systems",((t,e,n)=>{r.push(e)}));const a=t.sector.values().next().value,s=this.getEntityTemplate("sector"),o=this.getEntityTemplateData(r,a,a,e),i=n.filterByTagId(e,a.id);if(i.length){const t=i[0];return renderTemplate(s,o).then((e=>({_id:t.id,content:e})))}return null}getJournalUpdate(t,e,r,a){const s=t.get(e);if(null!=s){const t=s.filter((t=>t.id===r));if(t.length){const r=t[0],o=n.filterByTagId(a,r.id);if(o.length){const t=o[0],n=s.filter((t=>t.id===e));if(n.length){const e=n[0];return this.getJournalContent(s,e,r,a).then((e=>({_id:t.id,content:e})))}}}}return null}getJournalContent(t,e,n,r){const a=this.getEntityTemplate(n.type),s=this.getEntityTemplateData(t,e,n,r);return renderTemplate(a,s)}getEntityTemplateData(t,e,r,a){const s=t.filter((t=>t.parent===r.id)).map((t=>{const e={name:t.name,type:this.getTypeName(t.type),orbiting:!1,link:this.getJournalLink(a,t.id)};if("x"in t){const r=t;e.position=n.getSectorCoordinates(r.x-1,r.y-1)}return e}));return{...r,type:this.getTypeName(r.type),orbiting:!("moonBase"===r.type||"researchBase"===r.type),parentIsEntity:!("system"===r.parentEntity||"blackHole"===r.parentEntity),parentLink:this.getJournalLink(a,r.parent),parentType:this.getTypeName(r.parentEntity),systemLink:this.getJournalLink(a,e.id),systemType:this.getTypeName(e.type),sunType:"system"===r.parentEntity?"SUN":"BLACK HOLE",sunName:e.name,children:s,coordinates:"sector"!==r.type?n.getSectorCoordinates(e.x-1,e.y-1):null}}getJournalLink(t,e){const r=n.filterByTagId(t,e);return r.length?r[0].link:null}getEntityTemplate(t){return"sector"===t?n.getTemplatePath("sector.html"):"system"===t||"blackHole"===t?n.getTemplatePath("sun.html"):n.getTemplatePath("entity.html")}createScene(t,e){const r=t.sector.values().next().value,a=this.getSectorNotes(t,e),s=[];this.options.generateSectorCoordinates&&s.push(...this.getSectorLabels(t));const o={active:!0,backgroundColor:"#01162c",drawings:s,flags:n.getEntityFlags(r),grid:200,gridAlpha:.3,gridColor:"#99caff",gridDistance:1,gridType:CONST.GRID_TYPES.HEXODDQ,gridUnits:n.getLabel("HEX-UNIT-NAME"),height:this.getSceneHeight(r.rows),img:n.getImagePath("starField.png"),name:n.formatLabel("SCENE-NAME",{name:r.name}),padding:0,notes:a,width:this.getSceneWidth(r.columns)};return Scene.create(o)}getSectorLabels(t){const e=[],r=t.sector.values().next().value;for(let t=0;t<r.rows;t++)for(let a=0;a<r.columns;a++){const r=this.getHexCenterPosition(a,t),s={x:r.x,y:Math.floor(r.y+77.94228634059948),text:n.getSectorCoordinates(a,t),fontSize:16};e.push(s)}return e}getSectorNotes(t,e){const n=[];return this.getGroupedEntities(t).forEach(((r,a,s)=>{const o=this.getSystemById(t,a);o&&n.push(...this.getSystemNotes(o,e,r))})),n}getSystemNotes(t,e,n){const r=[];let a=n.filter((e=>e!=t));this.options.generateNotesForAllEntities||(a=a.filter((t=>"system"===t.parentEntity||"blackHole"===t.parentEntity)));for(let n=0;n<a.length;n++){const s=this.createEntityNote(t,e,a[n],a.length,n);s&&r.push(s)}const s=this.createEntityNote(t,e);return s&&r.push(s),r}getSystemById(t,e){const n=[];n.push(...t.system.values()),n.push(...t.blackHole.values());const r=n.filter((t=>t.id===e));return r.length?r[0]:null}getGroupedEntities(t){const e=new Map;t.system.forEach(((t,n,r)=>{e.set(n,[t])})),t.blackHole.forEach(((t,n,r)=>{e.set(n,[t])})),n.forEachEntity(t,"only-basic",((n,r,a)=>{var s;const o=this.getContainingSystemId(t,r);o&&(null===(s=e.get(o))||void 0===s||s.push(r))}));const r=new Map;return e.forEach(((t,e,n)=>{r.set(e,this.getSortedEntityArray(t))})),r}getSortedEntityArray(t){const e=[];if(t.filter((t=>"system"===t.type&&"sector"===t.parentEntity)).forEach((t=>e.push(t))),t.filter((t=>"blackHole"===t.type&&"sector"===t.parentEntity)).forEach((t=>e.push(t))),t.filter((t=>"planet"===t.type&&"system"===t.parentEntity)).forEach((n=>{e.push(n),t.filter((t=>"moon"===t.type&&t.parent===n.id)).forEach((n=>{e.push(n),t.filter((t=>"moonBase"===t.type&&t.parent===n.id)).forEach((t=>e.push(t))),t.filter((t=>"researchBase"===t.type&&t.parent===n.id)).forEach((t=>e.push(t))),t.filter((t=>"orbitalRuin"===t.type&&t.parent===n.id)).forEach((t=>e.push(t))),t.filter((t=>"refuelingStation"===t.type&&t.parent===n.id)).forEach((t=>e.push(t)))})),t.filter((t=>"researchBase"===t.type&&t.parent===n.id)).forEach((t=>e.push(t))),t.filter((t=>"gasGiantMine"===t.type&&t.parent===n.id)).forEach((t=>e.push(t))),t.filter((t=>"refuelingStation"===t.type&&t.parent===n.id)).forEach((t=>e.push(t))),t.filter((t=>"spaceStation"===t.type&&t.parent===n.id)).forEach((t=>e.push(t))),t.filter((t=>"orbitalRuin"===t.type&&t.parent===n.id)).forEach((t=>e.push(t)))})),t.filter((t=>"asteroidBelt"===t.type&&"system"===t.parentEntity)).forEach((n=>{e.push(n),t.filter((t=>"asteroidBase"===t.type&&t.parent===n.id)).forEach((t=>e.push(t))),t.filter((t=>"refuelingStation"===t.type&&t.parent===n.id)).forEach((t=>e.push(t))),t.filter((t=>"spaceStation"===t.type&&t.parent===n.id)).forEach((t=>e.push(t)))})),t.filter((t=>"refuelingStation"===t.type&&"system"===t.parentEntity)).forEach((t=>e.push(t))),t.filter((t=>"refuelingStation"===t.type&&"blackHole"===t.parentEntity)).forEach((t=>e.push(t))),t.filter((t=>"researchBase"===t.type&&"system"===t.parentEntity)).forEach((t=>e.push(t))),t.filter((t=>"researchBase"===t.type&&"blackHole"===t.parentEntity)).forEach((t=>e.push(t))),t.filter((t=>"deepSpaceStation"===t.type&&"system"===t.parentEntity)).forEach((t=>e.push(t))),t.filter((t=>"deepSpaceStation"===t.type&&"blackHole"===t.parentEntity)).forEach((t=>e.push(t))),e.length!=t.length)throw console.log(t,e),new Error("Some entity is not linked with its parent");return e}getSceneWidth(t){return Math.floor(150*t+50)}getSceneHeight(t){return Math.floor((t+1)*r)}createEntityNote(t,e,n,r,a){const s=this.getIconPosition(t,r,a);return s?{entryId:this.getJournalEntry(e,n?n.id:t.id),x:s.x,y:s.y,icon:this.getEntityIcon(n?n.type:t.type),iconSize:32,text:n?n.name:t.name,fontSize:32,textAnchor:s.tooltipPosition,iconTint:this.getIconTint(n?n.type:t.type)}:null}getIconTint(t){return"#ffffff"}getRandomColor(t,e){const n=hexToRGB(colorStringToHex(t));for(let t=0;t<3;t++){const r=Math.floor(Math.random()*e)-e/2;n[t]=n[t]+r,n[t]=Math.min(n[t],255),n[t]=Math.max(n[t],0)}return hexToRGBAString(rgbToHex(n))}getJournalEntry(t,e){const r=n.filterByTagId(t,e);return r.length?r[0].id:null}getEntityIcon(t){return n.getImagePath(t+".png")}getIconPosition(t,e,n){const r=this.getHexCenterPosition(t.x-1,t.y-1);let a={x:0,y:0},s=CONST.TEXT_ANCHOR_POINTS.CENTER;if(null!=e&&null!=n){const t=n*(2*Math.PI/e);s=t<=1/4*Math.PI?CONST.TEXT_ANCHOR_POINTS.RIGHT:t<=3/4*Math.PI?CONST.TEXT_ANCHOR_POINTS.BOTTOM:t<=5/4*Math.PI?CONST.TEXT_ANCHOR_POINTS.LEFT:t<=7/4*Math.PI?CONST.TEXT_ANCHOR_POINTS.TOP:CONST.TEXT_ANCHOR_POINTS.RIGHT,a=this.getEntityOffset(t)}return{x:Math.floor(r.x+a.x),y:Math.floor(r.y+a.y),tooltipPosition:s}}getHexCenterPosition(t,e){let n=0;return t%2==0&&(n=a),{x:Math.floor(150*t+100),y:Math.floor(r*e+a+n)}}getEntityOffset(t){return{x:Math.cos(t)*s,y:Math.sin(t)*s}}getContainingSystem(t,e){const n=this.getContainingSystemId(t,e);if(n){const e=t.system.get(n),r=t.blackHole.get(n);return e||r||null}return null}createJournals(t,e,r){const a=[];return n.forEachEntityType(t,"all",((s,o)=>{a.push(...this.createEntityJournals(t,n.getMapValues(o),e,r))})),JournalEntry.create(a).then((t=>n.getAsList(t)))}createEntityJournals(t,e,r,a){return e.map((e=>{const s={default:this.options.onlyGMJournals||e.isHidden?CONST.ENTITY_PERMISSIONS.NONE:CONST.ENTITY_PERMISSIONS.OBSERVER};return{type:"JournalEntry",name:this.getJournalName(e),folder:this.getContainingSystemFolder(t,r,a,e),content:e.name,flags:n.getEntityFlags(e),permission:s}}))}getContainingSystemFolder(t,e,r,a){if("sector"===a.type)return e.id;{const e=this.getContainingSystemId(t,a);if(e){const t=n.filterByTagId(r,e);return t.length?t[0].id:void 0}return}}getTypeName(t){switch(t){case"asteroidBase":return n.getLabel("ASTEROID-BASE");case"asteroidBelt":return n.getLabel("ASTEROID-BELT");case"blackHole":return n.getLabel("BLACK-HOLE");case"deepSpaceStation":return n.getLabel("DEEP-SPACE-STATION");case"gasGiantMine":return n.getLabel("GAS-GIANT-MINE");case"moon":return n.getLabel("MOON");case"moonBase":return n.getLabel("MOON-BASE");case"orbitalRuin":return n.getLabel("ORBITAL-RUIN");case"planet":return n.getLabel("PLANET");case"refuelingStation":return n.getLabel("REFUELING-STATION");case"researchBase":return n.getLabel("RESEARCH-BASE");case"sector":return n.getLabel("SECTOR");case"spaceStation":return n.getLabel("SPACE-STATION");case"system":return n.getLabel("SYSTEM");default:return null}}getJournalName(t){const e=this.getTypeName(t.type);return n.formatLabel("ENTITY-JOURNAL-NAME",{type:e,name:t.name})}createSystemJournalFolders(t,e){if(e){const r=[];return t.system.forEach(((t,a,s)=>{const o=n.formatLabel("SYSTEM-FOLDER-NAME",{name:t.name});r.push({name:o,type:"JournalEntry",parent:e,flags:n.getEntityFlags(t)})})),t.blackHole.forEach(((t,a,s)=>{const o=n.formatLabel("BLACK-HOLE-FOLDER-NAME",{name:t.name});r.push({name:o,type:"JournalEntry",parent:e,flags:n.getEntityFlags(t)})})),Folder.create(r).then((t=>n.getAsList(t)))}return Promise.resolve([])}createSectorJournalFolder(t){const e=t.sector.values().next().value,r=n.formatLabel("SECTOR-FOLDER-NAME",{name:e.name});return Folder.create({name:r,type:"JournalEntry",flags:n.getEntityFlags(e)})}getContainingSystemId(t,e){if(e.parentEntity){if("sector"===e.parentEntity)return e.id;if("system"===e.parentEntity||"blackHole"===e.parentEntity)return e.parent;{const n=t[e.parentEntity].get(e.parent);return n?this.getContainingSystemId(t,n):null}}return null}}let i;Hooks.once("init",(async()=>{i=new o})),Hooks.once("ready",(async()=>{})),Hooks.on("renderSceneDirectory",(function(t,e){i.initUI(e)}))})();
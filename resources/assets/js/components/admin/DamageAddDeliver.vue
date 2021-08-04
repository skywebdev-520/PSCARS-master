<template>
<md-card  style="width:380px;margin-top:20px;margin-bottom:20px" >
    <form style="">
 
      <div
        v-bind:style="{ background: 'url(/img/car_dmg/'+cartype+'.png) 0% 0% / cover',height:188+'px'}" 
        >
            <Konva-stage :config="configKonva" :ref="'stage'" >
                <Konva-layer :ref="'layer'">
                </Konva-layer>
            </Konva-stage>
        </div>
        <md-card-content>
            <md-field>
                <label for="movie">Fahrzeugtyp</label>
                <md-select v-model="cartype" name="movie" id="movie">
                    <md-option value="familienwagen">Familienwagen</md-option>
                    <md-option value="kombi">Kombi</md-option>
                    <md-option value="limousine">Limousine</md-option>
                    <md-option value="sportwagen">Sportwagen</md-option>
                    <md-option value="sportwagen_2">Super Sportwagen</md-option>
                    <md-option value="suv">SUV</md-option>
                </md-select>
            </md-field>

            <md-field>
                <input ref="file" v-on:change="onChangeFileUpload()" type="file" class="custom-file-input" id="inputGroupFile01">
            </md-field>
            <md-field>
                <label>Beschreibung</label>
                <md-textarea v-model="description"></md-textarea>
            </md-field>
        </md-card-content>
        <md-progress-bar v-if="loading" md-mode="indeterminate"></md-progress-bar>
        <md-card-actions>
            <md-button :disabled="loading" class="md-raised md-primary" @click="submitForm()">Speichern</md-button>
        </md-card-actions>

    </form>

</md-card>
</template>


<script>
import {Circle} from "Konva";

function getRelativePointerPosition(node) {
    var transform = node.getAbsoluteTransform().copy();
    transform.invert();
    var pos = node.getStage().getPointerPosition();
    return transform.point(pos);
}
export default {
  name: "DamageAdd",
  props: ['book'],
  watch: {
  },
  methods: {
      
      async submitForm(){
            this.loading = true
            let formData = new FormData();
            formData.append('file', this.file);
            formData.append('mark', this.$refs["stage"].getNode().toDataURL());
            formData.append('description', this.description);
            formData.append('type', this.cartype);
            
            this.axios.post('/admin/damages/add/book/'+this.book.id,
                formData,
                {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
              }
            ).then((data)=>{
                window.v_deliver.dmgRefresh()
                this.loading = false
            })
            .catch(function(){
            });
      },

      onChangeFileUpload(){
        this.file = this.$refs.file.files[0];
      }
  },
  mounted() {
        this.stage = this.$refs["stage"].getNode();
        this.layer = this.$refs["layer"].getNode();
    
        this.stage.on('click', ()=>{
            var pos = getRelativePointerPosition(this.layer);
            var shape = new Circle({
                x: pos.x,
                y: pos.y,
                stroke: 'red',
                strokeWidth:3,
                radius: 10
            });

            this.layer.add(shape);
            this.layer.batchDraw();
        });
  },
  data() {
    return {
        loading:false,
        description:"",
        cartype: "familienwagen",
        file: '',
        id:window.data,
        configKonva: {
            width: 450,
            height: 215
        },
        successfull:false
    };
  }
};
</script>
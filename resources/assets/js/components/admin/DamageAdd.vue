<template>
    <form>
 
      <div
        v-bind:style="{ background: 'url(/img/car_dmg/'+cartype+'.png) 0% 0% / cover',height:215+'px'}" 
        >
            <Konva-stage :config="configKonva" :ref="'stage'" >
                <Konva-layer :ref="'layer'">
                </Konva-layer>
            </Konva-stage>
        </div>

        <div class="form-group">
            <label for="cartype">Fahrzeugtyp</label>
            <select class="form-control" v-model="cartype" name="cartype" id="cartype">
                <option value="familienwagen">Familienwagen</option>
                <option value="kombi">Kombi</option>
                <option value="limousine">Limousine</option>
                <option value="sportwagen">Sportwagen</option>
                <option value="sportwagen_2">Super Sportwagen</option>
                <option value="suv">SUV</option>
            </select>
        </div>
        <div class="form-group">
            <label for="exampleInputEmail1">Bild hochladen</label>
            <div class="custom-file">
                <input ref="file" v-on:change="onChangeFileUpload()" type="file" class="custom-file-input" id="inputGroupFile01">
                <label class="custom-file-label" for="inputGroupFile01">Datei auswählen</label>
            </div>
        </div>

        <div class="form-group">
            <label >Beschreibung</label>
            <textarea v-model="description"  class="form-control" rows="3"></textarea>
        </div>
        <button type="button" v-on:click="submitForm()" class="btn btn-primary btn-block">Speichern</button>
    </form>
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
  watch: {
  },
  methods: {
      
      async submitForm(){

            let formData = new FormData();
            formData.append('file', this.file);
            formData.append('mark', this.$refs["stage"].getNode().toDataURL());
            formData.append('description', this.description);
            formData.append('type', this.cartype);
            
            this.axios.post('/admin/damages/view/'+this.id+"/images",
                formData,
                {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
              }
            ).then(function(data){
              location.reload()
            })
            .catch(function(){
              location.reload()
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
        
        description:"",
        cartype: "familienwagen",
        file: '',
        id:window.data,
        configKonva: {
            width: 400,
            height: 188
        },
    };
  }
};
</script>
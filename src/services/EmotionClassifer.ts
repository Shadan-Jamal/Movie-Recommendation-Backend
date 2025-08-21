import {pipeline, TextClassificationOutput} from "@xenova/transformers"

export class EmotionClassifier {
    private classifier : any;
    constructor(){
        this.initializeClassifier();
    }

    private async initializeClassifier(){
        this.classifier = await pipeline(
            "text-classification",
            "MicahB/roberta-base-go_emotions"
        )
    }

    async detectEmotion(
        input : string,
        options : {
            topk : number
        }
    ) : Promise<string>{

        if(!this.classifier) await this.initializeClassifier()
        const result  = await this.classifier(input, options)
        return result[0].label
    }
}
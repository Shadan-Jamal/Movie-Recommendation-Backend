import {pipeline, Tensor} from "@xenova/transformers"

export class DescriptionClassifier{
    private classifier : any;
    constructor(){
        this.initializeClassifier()
    }

    private async initializeClassifier(){
        this.classifier = await pipeline(
            "feature-extraction",
            "Xenova/all-MiniLM-L6-v2",
        )
    }

    async getEmbedding(
        plot: string,
        options : { pooling: string; normalize: boolean }
    ): Promise<Tensor> {
        const result : Tensor = await this.classifier(plot, options);
        return result
    }
    
}

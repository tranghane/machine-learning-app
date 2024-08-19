import { pipeline } from '@xenova/transformers';

class MyTranslationPipeline {
    static task = 'translation'; //task type
    static model = 'Xenova/nllb-200-distilled-600M'; //model used for translation
    static instance = null; //signleton instance, initialized to null

    //create a singleton instance of the pipeline
    static async getInstance(progress_callback = null) {
        //if instance is null, create one using pipeline function
        if (this.instance === null) {
            this.instance = pipeline(this.task, this.model, { progress_callback });
            // pipeline take in taskm, model, and options
        }

        return this.instance;
    }
}

self.addEventListener('message', async (event) => {
    //wait to get an instance to use it
    let translator = await MyTranslationPipeline.getInstance(x => {
        self.postMessage(x) //send message
    })
    console.log(event.data)
    //call the translate function through the translator instance
    let output = await translator(event.data.text, {

        //inputs for translate function, 
        tgt_lang: event.data.tgt_lang,
        src_lang: event.data.src_lang,

        callback_function: x => {
            self.postMessage({
                status: 'update',
                output: translator.tokenizer.decode(x[0].output_token_ids, { skip_special_tokens: true })
            })
        }
    })

    console.log('HEHEHHERERE', output)

    self.postMessage({
        status: 'complete',
        output
    })
})
/*  Team Sonus - 2016
 *  ------------------------------------------------------------
 *  Uses CMU pocketsphinx to reconize voice commands
 *  Language is set via arg[1]
 *  Recieves a path to a raw file as arg[2]
 *  Writes the recognized string to stdout, delimitted by |string|
 */
#include <stdio.h>
#include <pocketsphinx.h>

ps_decoder_t *ps;   // decoder
FILE *fh;           // audio file

int processRaw(const char *rawFile) {
    const char *hyp, *uttid;
    int16 buf[512];
    int rv;
    int32 score;

    // Open the wav file passed from argument
    printf("file: %s\n", rawFile);
    fh = fopen(rawFile, "rb");
    if (fh == NULL) {
        fprintf(stderr, "Unable to open input file %s\n", rawFile);
        return -1;
    }

    // Start utterance
    rv = ps_start_utt(ps);
    
    // Process buffer, 512 samples at a time
    while (!feof(fh)) {
        size_t nsamp;
        nsamp = fread(buf, 2, 512, fh);
        rv = ps_process_raw(ps, buf, nsamp, FALSE, FALSE);
    }
    
    // Recieve the recognized string
    rv = ps_end_utt(ps);
    hyp = ps_get_hyp(ps, &score);
    printf("Recognized: |%s|\n", hyp);

    // Close file
    fclose(fh);

    return 0;
}

int main(int argc, char *argv[]) {
    int go;
    const char *lang    = argv[1];
    const char *rawFile = argv[2];
    cmd_ln_t *config;

    // Configure recognizer for English or Spanish
    if (strcmp(lang, "engl") == 0) {
        config = cmd_ln_init(NULL, ps_args(), TRUE,
                "-hmm",    MODELDIR "/en-us/en-us",
                "-lm",     MODELDIR "/en-us/en-us.lm.bin",
                "-dict",   MODELDIR "/en-us/cmudict-en-us.dict",
                NULL);

    } else if (strcmp(lang, "span") == 0) {
        printf("Not implemented\n");
        return 0;
    }

    if (config == NULL) {
        fprintf(stderr, "Failed to create config object, see log for details\n");
        return -1;
    }
    
    // Initialize pocketsphinx
    ps = ps_init(config);
    if (ps == NULL) {
        fprintf(stderr, "Failed to create recognizer, see log for details\n");
        return -1;
    }

    // Wait for signal from stdin
    while (1) {
        scanf("%d", &go);
        if (go) {
            processRaw(rawFile);
        } else break;
    }

    // free memory
    ps_free(ps);
    cmd_ln_free_r(config);
    
    return 0;
}

/*  Team Sonus - 2016
 *  ------------------------------------------------------------
 *  Test for reading in lang and raw args
 *  Enters inifite loop to simulate recognizer process
 */
#include <stdio.h>

int main(int argc, char *argv[]) {
    int go;
    const char *lang    = argv[1];
    const char *rawFile = argv[2];

    printf("we made it\n");
    printf("%s\n", lang);

    while (1) {
        // Waiting for command
        scanf("%d", &go);
        if (go) {
            printf("%s\n", rawFile);
        } else break;
    }
    
    return 0;
}

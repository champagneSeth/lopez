# Lopez the bilingual robot

Spring 2016 CMPS 375 Project by Isabella Bendana, Seth Champagne, and Nicholas Moran.

This is a modified version of the [WeselyWebService](https://github.com/atreayou/WeslyWebService). The project specifically controls a DC motor, four wheel robot. The robot hosts a webpage through an Express app that gives a GUI for controls. The user can record voice commands to post to the robot. Audio is posted as wav files and recognized by CMU PocketSphinx. ~~The project currently supports both English and Spanish commands.~~

### Project Dependencies:
- [CMU Sphinx common libraries](https://github.com/cmusphinx/sphinxbase)
- [PocketSphinx 5prealpha](https://github.com/cmusphinx/pocketsphinx)

## Usage Instructions
1. Project should be installed on a Raspberry Pi with wireless connectivity.
2. Sphinxbase and PocketSphinx should both be installed onto the Pi.
3. Use `$ ./sonus/compile.sh` to build the sonus.c recognizer.
4. Run `npm install` to get node dependencies.
5. Run the Recognizer service using `npm start` or `node server`.

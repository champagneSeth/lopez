import RPi.GPIO as GPIO
from time import sleep

print('start')

rf1 = 13
rf2 = 15
rfe = 21

GPIO.setmode(GPIO.BOARD)

GPIO.setup(rfe, GPIO.OUT)
GPIO.setup(rf1, GPIO.OUT)
GPIO.setup(rf2, GPIO.OUT)

GPIO.output(rfe, GPIO.HIGH)
GPIO.output(rf1, GPIO.HIGH)
GPIO.output(rf2, GPIO.LOW)

sleep(3)

print('we made it')
GPIO.output(rfe, GPIO.LOW)

GPIO.cleanup()


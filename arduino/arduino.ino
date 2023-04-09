// this code uses the potentiometer on the Arduino Sensor Kit (https://sensorkit.arduino.cc/)

const int knob0Pin = A0;
// const int knob1Pin = A1;
const int buttonPin = 4;  // the pin that the pushbutton is attached to
int knob0Val = 0;
int knob1Val = 0;
int output0Val = 0;
int output1Val = 0;

int buttonPushCounter = 0;  // counter for the number of button presses
int buttonState = 0;        // current state of the button
int lastButtonState = 0;    // previous state of the button
int buttonPress = 0;

void setup() {
  pinMode(buttonPin, INPUT);
  Serial.begin(9600);
}

void loop() {
  knob0Val = analogRead(knob0Pin);
  knob1Val = analogRead(knob0Pin); // TODO: change to knob1Pin

  buttonState = digitalRead(buttonPin);
  if (buttonState == LOW && lastButtonState == HIGH) {
    buttonPress = 1;
  } else {
    buttonPress = 0;
  }
  lastButtonState = buttonState;

  output0Val = map(knob0Val, 0, 1023, 0, 29);
  output1Val = map(knob0Val, 0, 1023, 0, 29); // TODO: knob0Val

  String output = "Xk0";
  output += output0Val;
  output += "Xk1";
  output += output1Val;
  output += "Xb0";
  output += buttonPress;

  Serial.println(output);
  delay(50);
}

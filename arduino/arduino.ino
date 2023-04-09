#define CLK1 2
#define DT1 3
#define CLK2 5
#define DT2 6
#define BTN 4

int currentStateCLK1, currentStateCLK2;
int lastStateCLK1, lastStateCLK2;

int btnState = 0;        // current state of the button
int lastBtnState = HIGH;    // previous state of the button

String output;

void setup() {
	pinMode(CLK1,INPUT);
  pinMode(CLK2,INPUT);
	pinMode(DT1,INPUT);
  pinMode(DT2,INPUT);
	pinMode(BTN, INPUT_PULLUP);

  // Read the initial state of CLK
	lastStateCLK1 = digitalRead(CLK1);
  lastStateCLK2 = digitalRead(CLK2);

  Serial.begin(9600);
}

void loop() {
  // Read the current state of CLK
	currentStateCLK1 = digitalRead(CLK1);
  currentStateCLK2 = digitalRead(CLK2);

  // If last and current state of CLK are different, then pulse occurred
	// React to only 1 state change to avoid double count
	if (currentStateCLK1 != lastStateCLK1  && currentStateCLK1 == 1){
		// If the DT state is different than the CLK state then
		// the encoder is rotating CCW so decrement
		if (digitalRead(DT1) != currentStateCLK1) {
      output = "Xr1-1";
		} else {
			// Encoder is rotating CW
			output = "Xr1+1";
		}
    Serial.println(output);
	}
  // Remember last CLK state
	lastStateCLK1 = currentStateCLK1;

  if (currentStateCLK2 != lastStateCLK2  && currentStateCLK2 == 1){
		if (digitalRead(DT2) != currentStateCLK2) {
      output = "Xr2-1";
		} else {
			output = "Xr2+1";
		}
    Serial.println(output);
	}
  lastStateCLK2 = currentStateCLK2;

  // Read the button state
	btnState = digitalRead(BTN);
  //If we detect LOW signal edge, button is pressed
  if (btnState == LOW && lastBtnState == HIGH) {
    output = "Xbt1";
    Serial.println(output);
  }
  lastBtnState = btnState;

  delay(10);
}

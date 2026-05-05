import sys
import pyttsx3


def main():
    text = " ".join(sys.argv[1:]).strip()
    if not text:
        return
    engine = pyttsx3.init()
    engine.setProperty("rate", 175)
    engine.setProperty("volume", 1.0)
    engine.say(text)
    engine.runAndWait()


if __name__ == "__main__":
    main()

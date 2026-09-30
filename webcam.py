from ultralytics import YOLO
import cv2
import time

# ----------------------------
# 1. Load YOLOv8 Classification Model
# ----------------------------
MODEL_PATH = r"C:\Users\navya\navya\navya - vdc\project\hackathon\yolov8s-cls.pt"
model = YOLO(MODEL_PATH)

# ----------------------------
# 2. Open Webcam
# ----------------------------
cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

print("🎥 Webcam started. Press Q to quit.\n")

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        print("❌ Failed to grab frame")
        break

    # ----------------------------
    # 3. Predict
    # ----------------------------
    results = model(frame, verbose=False)

    r = results[0]
    top_class_idx = r.probs.top1
    top_class_name = model.names[top_class_idx]
    top_conf = r.probs.top1conf.item() * 100

    # ----------------------------
    # 4. Draw prediction on frame
    # ----------------------------
    label = f"{top_class_name}: {top_conf:.2f}%"

    cv2.rectangle(frame, (10, 10), (420, 80), (0, 0, 0), -1)
    cv2.putText(
        frame,
        label,
        (20, 55),
        cv2.FONT_HERSHEY_SIMPLEX,
        1.2,
        (0, 255, 0),
        3
    )

    # ----------------------------
    # 5. Show Webcam Window
    # ----------------------------
    cv2.imshow("YOLOv8 Webcam Classification", frame)

    # Press Q to exit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
print("✅ Webcam closed successfully")

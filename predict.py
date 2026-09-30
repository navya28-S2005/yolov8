from ultralytics import YOLO
import os
import glob
import random
import matplotlib.pyplot as plt
import matplotlib.image as mpimg

# ==============================
# PATHS
# ==============================
MODEL_PATH = r"C:\Users\navya\navya\navya - vdc\project\hackathon\yolov8s-cls.pt"
VAL_DIR = r"C:\Users\navya\navya\navya - vdc\project\hackathon\dataset\val"

NUM_IMAGES = 10  # number of random images to predict

# ==============================
# LOAD MODEL
# ==============================
model = YOLO(MODEL_PATH)

# ==============================
# COLLECT IMAGES
# ==============================
image_files = []
image_labels = []

for cls in os.listdir(VAL_DIR):
    class_path = os.path.join(VAL_DIR, cls)
    if os.path.isdir(class_path):
        for ext in ("*.jpg", "*.png", "*.jpeg"):
            files = glob.glob(os.path.join(class_path, ext))
            image_files.extend(files)
            image_labels.extend([cls]*len(files))

if len(image_files) == 0:
    raise RuntimeError("❌ No images found in val folder")

# Pick random images
indices = random.sample(range(len(image_files)), min(NUM_IMAGES, len(image_files)))
selected_images = [image_files[i] for i in indices]
selected_labels = [image_labels[i] for i in indices]

# ==============================
# PREDICT & DISPLAY EACH IMAGE
# ==============================
for img_path, actual_class in zip(selected_images, selected_labels):
    results = model.predict(source=img_path, device="cpu", imgsz=150, stream=False, verbose=False)
    r = results[0]
    pred_class_id = r.probs.top1
    pred_conf = r.probs.top1conf
    pred_class_name = model.names[pred_class_id]

    # Display image with actual and predicted labels
    img = mpimg.imread(img_path)
    plt.figure(figsize=(5,5))
    plt.imshow(img)
    plt.axis('off')
    plt.title(f"Predicted: {pred_class_name} ({pred_conf*100:.1f}%)\nActual: {actual_class}", fontsize=12)
    plt.show()

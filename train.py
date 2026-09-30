# train_yolo_cpu_4class.py
# YOLOv8 Classification Training (CPU ONLY)
# 4 Classes: ripe, unripe, rotten, not_fruit

from ultralytics import YOLO
import os
import sys
import time
import shutil
import glob
import torch

# ================================
# 1. PATHS & HYPERPARAMETERS
# ================================
DATA_DIR = r"C:\Users\navya\navya\navya - vdc\project\hackathon\dataset"
OUTPUT_MODEL_PT = r"C:\Users\navya\navya\navya - vdc\project\hackathon\yolov8s-cls.pt"

EPOCHS = 15
IMGSZ = 150
BATCH = 8        # safe for CPU
WORKERS = 2      # safe for CPU

# ================================
# 2. VERIFY DATASET
# ================================
train_dir = os.path.join(DATA_DIR, "train")
val_dir = os.path.join(DATA_DIR, "val")

if not os.path.exists(train_dir):
    print("❌ train/ folder missing")
    sys.exit(1)

classes = sorted([d for d in os.listdir(train_dir)
                  if os.path.isdir(os.path.join(train_dir, d))])

if len(classes) == 0:
    print("❌ No class folders found in train/")
    sys.exit(1)

print("✅ Classes detected from train/:")
for c in classes:
    print("  -", c)

if not os.path.exists(val_dir):
    print("⚠ val/ folder not found. Training will continue without validation")

# ================================
# 3. LOAD PRETRAINED MODEL
# ================================
print("\nLoading YOLOv8 classification model...")
model = YOLO("yolov8s-cls.pt")

# ================================
# 4. FORCE CPU
# ================================
print("⚠ Training forced on CPU")
print("Torch CUDA available:", torch.cuda.is_available())

# ================================
# 5. TRAIN MODEL
# ================================
print("\n🚀 Starting training...")
start_time = time.time()

model.train(
    data=DATA_DIR,      # uses train/ and val/ folders
    epochs=EPOCHS,
    imgsz=IMGSZ,
    batch=BATCH,
    device="cpu",       # FORCE CPU
    workers=WORKERS
)

elapsed = time.time() - start_time
print(f"\n✅ Training completed in {elapsed/60:.2f} minutes")

# ================================
# 6. FIND AND SAVE BEST MODEL
# ================================
def find_best_weight():
    runs = sorted(glob.glob("runs/classify/train*"), key=os.path.getmtime, reverse=True)
    for r in runs:
        best = os.path.join(r, "weights", "best.pt")
        if os.path.exists(best):
            return best
    return None

best_model = find_best_weight()

if best_model:
    os.makedirs(os.path.dirname(OUTPUT_MODEL_PT), exist_ok=True)
    shutil.copy2(best_model, OUTPUT_MODEL_PT)
    print(f"✅ Best model copied to:\n{OUTPUT_MODEL_PT}")
else:
    print("❌ best.pt not found")

print("\n🎉 TRAINING COMPLETE")

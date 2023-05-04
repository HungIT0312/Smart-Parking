
import cv2
import numpy as np
from .lib_detection import load_model_1, detect_lp, im2single
from .lib_findcontours import segment_characters
import sys
def mode_AI(img):
    wpod_net_path = "./File/wpod-net_update1.json"
    wpod_net = load_model_1(wpod_net_path)

    # Đọc file ảnh đầu vào
    Ivehicle = img

    # Kích thước lớn nhất và nhỏ nhất của 1 chiều ảnh
    Dmax = 608
    Dmin = 288

    # Lấy tỷ lệ giữa W và H của ảnh và tìm ra chiều nhỏ nhất
    ratio = float(max(Ivehicle.shape[:2])) / min(Ivehicle.shape[:2])
    side = int(ratio * Dmin)
    bound_dim = min(side, Dmax)
    LpImg = None
    lp_type = None
    try:
        _, LpImg, lp_type = detect_lp(wpod_net, im2single(Ivehicle), bound_dim, lp_threshold=0.5)
    except Exception:
        print("Không nhận diện được biển số")
        sys.exit(1)

    # Cau hinh tham so cho model SVM
    digit_w = 30  # Kich thuoc ki tu
    digit_h = 60  # Kiczh thuoc ki tu
    model_svm = cv2.ml.SVM_load('./File/svm.xml')

    if (len(LpImg)):

        # Chuyen doi anh bien so
        LpImg[0] = cv2.convertScaleAbs(LpImg[0], alpha=(255.0))
        img = LpImg[0]
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        blurred = cv2.GaussianBlur(gray, (3, 3), cv2.BORDER_DEFAULT)
        roi = cv2.adaptiveThreshold(blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                    cv2.THRESH_BINARY, 199, 5)
        if (lp_type == 2):
            char = []
            height, width, _ = img.shape
            midpoint = height // 2

            # Chia đôi ảnh theo chiều ngang
            top_half = roi[:midpoint + 10, :]
            bottom_half = roi[midpoint - 10:, :]

            # Tim counter cua tung anh
            char_top, type_check = segment_characters(top_half, 200, 11, 2)
            char_bottom, type_check = segment_characters(bottom_half, 200, 10, 2)
            if char_bottom.shape[0] > 5:
                char_bottom = char_bottom[0:char_bottom.shape[0] - 1]

            for i in range(0, char_top.shape[0]):
                char.append(char_top[i])
            for i in range(0, char_bottom.shape[0]):
                char.append(char_bottom[i])
            char = np.array(char)
        else:
            char, type_check = segment_characters(roi, 333, 16, 1)
        if char.shape[0] > 8 and type_check == 1:
            char = char[0:char.shape[0] - 1]

        plate_info = ""
        for curr_num in char:
            curr_num = cv2.resize(curr_num, dsize=(digit_w, digit_h))
            curr_num = np.array(curr_num, dtype=np.float32)
            curr_num = curr_num.reshape(-1, digit_w * digit_h)
            result = model_svm.predict(curr_num)[1]
            result = int(result[0, 0])

            if result <= 9:  # Neu la so thi hien thi luon
                result = str(result)
            else:  # Neu la chu thi chuyen bang ASCII
                result = chr(result)

            plate_info += result
    return plate_info








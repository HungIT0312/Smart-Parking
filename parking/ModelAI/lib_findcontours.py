
import cv2
import numpy as np

def sort_contours(cnts):

    reverse = False
    i = 0
    boundingBoxes = [cv2.boundingRect(c) for c in cnts]
    (cnts, boundingBoxes) = zip(*sorted(zip(cnts, boundingBoxes),
                                        key=lambda b: b[1][i], reverse=reverse))
    return cnts

char_list =  '0123456789ABCDEFGHKLMNPRSTUVXYZ'
def fine_tune(lp):
    newString = ""
    for i in range(len(lp)):
        if lp[i] in char_list:
            newString += lp[i]
    return newString
def check(arr):
    dem = 0
    for i in range(0, len(arr)):

        for k in range(i + 1, len(arr) - 1):
            if arr[k] - arr[i] > 30 :
               dem+=1

    if dem > 0 :return 1
    else :return 0
def find_contour(dimensions, img , sort ,imgContour,type):
    cntrs, _ = cv2.findContours(img.copy(), cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    y_check = []
    cntrs = sorted(cntrs, key=cv2.contourArea, reverse=True)[:sort]
    ii =imgContour
    if type == 1:
        for cntr in cntrs:
            intX, intY, intWidth, intHeight = cv2.boundingRect(cntr)
            if intHeight / ii.shape[0] >= 0.3 and intWidth / ii.shape[0] >= 0.15 and intX > 1  and intWidth*intHeight < 2450 :
                y_check.append(intY)
        if check(y_check) == 1:
            img_res = find_contours_2(dimensions,img,sort,imgContour)
            type_check = 3
        else:
            img_res =find_contours_1(dimensions,img,sort,imgContour,type)
            type_check = 1
    else:
        img_res = find_contours_1(dimensions, img, sort, imgContour,type)
        type_check = 2

    return img_res,type_check
def height_avg(cnts,imgContour) :
    height_sum = 0
    dem = 0

    ii = imgContour
    arr = sorted(cnts, key=cv2.contourArea, reverse=True)[:5]
    for contour in arr:
        intX, intY, intWidth, intHeight = cv2.boundingRect(contour)
        if intHeight / ii.shape[0] >= 0.6 and intWidth / ii.shape[0] >= 0.12 and intX >= 2 and intWidth * intHeight >= 550 and intWidth * intHeight < 2450 and intHeight /ii.shape[0] <= 0.8 :
                (x, y, w, h) = cv2.boundingRect(contour)
                height_sum += h
                dem = dem +1
    if dem != 0 :
        avg_height = height_sum / dem
    else : avg_height = 0
    return  avg_height
def height_avg_2(cnts,imgContour) :
    height_sum = 0
    dem = 0
    ii = imgContour
    arr = sorted(cnts, key=cv2.contourArea, reverse=True)[:5]
    for contour in arr:
        intX, intY, intWidth, intHeight = cv2.boundingRect(contour)
        if intHeight / ii.shape[0] >= 0.25 and intWidth / ii.shape[0] >= 0.12 and intHeight / ii.shape[0] <= 0.5 and intHeight*intHeight > 370 and intWidth*intHeight > 462:
                (x, y, w, h) = cv2.boundingRect(contour)
                height_sum += h
                dem = dem +1
    if dem != 0 :
        avg_height = height_sum / dem
    else : avg_height =0
    return  avg_height
def find_contours_1(dimensions, img , sort ,imgContour,type):
    cntrs, _ = cv2.findContours(img.copy(), cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    if type == 1:
        x=2
    else : x=1
    cntrs = sorted(cntrs, key=cv2.contourArea, reverse=True)[:sort]
    height_avg_ = height_avg(cntrs,imgContour)
    ii = imgContour
    x_cntr_list = []
    img_res = []
    for cntr in cntrs:


        intX, intY, intWidth, intHeight = cv2.boundingRect(cntr)
        if intHeight / ii.shape[0] >= 0.4  and intWidth / ii.shape[0] >= 0.12  and intX > x and intWidth*intHeight >=550  and intWidth*intHeight < 2450 and  intHeight / ii.shape[0] <= 0.8 and height_avg_ - intHeight < 5.5  and height_avg_ - intHeight >= -5.5  :
                x_cntr_list.append(intX)
                char_copy = np.zeros((44, 24))
                char = img[intY:intY + intHeight, intX:intX + intWidth]
                char = cv2.resize(char, (20, 40))
                cv2.rectangle(ii, (intX, intY), (intWidth + intX, intY + intHeight), (50, 21, 200), 2)
                char = cv2.subtract(255, char)

            # Resize the image to 24x44 with black border
                char_copy[2:42, 2:22] = char
                char_copy[0:2, :] = 255
                char_copy[:, 0:2] = 255
                char_copy[42:44, :] = 255
                char_copy[:, 22:24] = 255

                img_res.append(char_copy)  # List that stores the character's binary image (unsorted)


    # Return characters on ascending order with respect to the x-coordinate (most-left character first)


    # arbitrary function that stores sorted list of character indeces
    indices = sorted(range(len(x_cntr_list)), key=lambda k: x_cntr_list[k])
    img_res_copy = []
    for idx in indices:
        img_res_copy.append(img_res[idx])  # stores character images according to their index

    img_res = np.array(img_res_copy)

    return img_res
def find_contours_2(dimensions, img , sort ,imgContour):

    cntrs, _ = cv2.findContours(img.copy(), cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    cntrs = sorted(cntrs, key=cv2.contourArea, reverse=True)[:sort]
    ii = imgContour
    upper=[]
    lowwer=[]
    x_cntr_list = []
    y_cntr_list =[]
    img_res = []
    height_avg = height_avg_2(cntrs,imgContour)
    for cntr in cntrs:
        perimeter = cv2.arcLength(cntr, True)
        intX, intY, intWidth, intHeight = cv2.boundingRect(cntr)

        if intHeight / ii.shape[0] >= 0.25 and intX > 2 and intWidth / ii.shape[0] >= 0.12 and perimeter < 350 and intHeight / ii.shape[0] <= 0.5 and intHeight*intHeight > 370 and intWidth*intHeight > 462 and height_avg - intHeight < 5 :

            x_cntr_list.append(intX)
            y_cntr_list.append(intY)
            char_copy = np.zeros((44, 24))
            char = img[intY:intY + intHeight, intX:intX + intWidth]
            char = cv2.resize(char, (20, 40))
            cv2.rectangle(ii, (intX, intY), (intWidth + intX, intY + intHeight), (50, 21, 200), 2)
            char = cv2.subtract(255, char)

            # Resize the image to 24x44 with black border
            char_copy[2:42, 2:22] = char
            char_copy[0:2, :] = 255
            char_copy[:, 0:2] = 255
            char_copy[42:44, :] = 255
            char_copy[:, 22:24] = 255
            img_res.append(char_copy)  # List that stores the character's binary image (unsorted)
    indices = sorted(range(len(y_cntr_list)), key=lambda k: y_cntr_list[k])

    img_res_copy = []
    x_copy=[]

    k=0
    if len(y_cntr_list) == 8 or len(y_cntr_list) == 7 :
        k=3
    else:
        k=4
    for idx in indices:

        x_copy.append(x_cntr_list[idx])
        img_res_copy.append(img_res[idx])

    x_upper = []
    x_lower = []
    for i in range (0,len(x_cntr_list)):
        if i < k :
            upper.append(img_res_copy[i])
            x_upper.append(x_copy[i])
        else :
            lowwer.append(img_res_copy[i])
            x_lower.append(x_copy[i])
    X_upper_indices = sorted(range(len(x_upper)), key=lambda k: x_upper[k])
    Y_lower_indices = sorted(range(len(x_lower)), key=lambda k: x_lower[k])
    img_upper_copy=[]
    img_lower_copy = []
    for idx in X_upper_indices:
        img_upper_copy.append(upper[idx])
    for idx in Y_lower_indices:
        img_lower_copy.append(lowwer[idx])
    img_upper_copy.extend(img_lower_copy)
    img_res = np.array(img_upper_copy)
    return img_res
def segment_characters(image,size,sort,type) :


    img_lp = cv2.resize(image, (size, 75))
    _, img_binary_lp = cv2.threshold(img_lp, 200, 255, cv2.THRESH_BINARY+cv2.THRESH_OTSU)
    img_binary_lp = cv2.erode(img_lp, (3,3))
    img_binary_lp = cv2.dilate(img_binary_lp, (3,3))
    #
    LP_WIDTH = img_lp.shape[0]
    LP_HEIGHT = img_lp.shape[1]
    #
    # Make borders white
    img_binary_lp[0:3,:] = 255
    img_binary_lp[:,0:3] = 255
    img_binary_lp[72:75,:] = 255
    img_binary_lp[:,330:333] = 255
    cv2.imwrite('contour.jpg', img_binary_lp)
    # Estimations of character contours sizes of cropped license plates
    dimensions = [LP_WIDTH/6,
                       LP_WIDTH/2,
                       LP_HEIGHT/10,
                       2*LP_HEIGHT/3]

    char_list , type_check = find_contour(dimensions, img_binary_lp, sort, img_binary_lp,type)



    return char_list ,type_check
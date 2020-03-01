//
//  AffdexSDK.m
//  AWSCore
//
//  Created by Alina Walling on 2/27/20.
//

#import "AffdexSDK.h"

@implementation AffdexSDK

RCT_EXPORT_MODULE();

// This is a convenience method that is called by the detector:hasResults:forImage:atTime: delegate method below.
// You will want to do something with the face (or faces) found.
RCT_EXPORT_METHOD(processedImageReady:(AFDXDetector *)detector image:(UIImage *)image faces:(NSDictionary *)faces atTime:(NSTimeInterval)time);
{
    // iterate on the values of the faces dictionary
    for (AFDXFace *face in [faces allValues])
    {
        // Here's where you actually "do stuff" with the face object (e.g. examine the emotions, expressions,
        // emojis, and other metrics).
        NSLog(@"%@", face);
    }
}

// This is a convenience method that is called by the detector:hasResults:forImage:atTime: delegate method below.
// It handles all UNPROCESSED images from the detector. Here I am displaying those images on the camera view.
RCT_EXPORT_METHOD(unprocessedImageReady:(AFDXDetector *)detector image:(UIImage *)image atTime:(NSTimeInterval)time);
{
    ViewController * __weak weakSelf = self;
    
    // UI work must be done on the main thread, so dispatch it there.
    dispatch_async(dispatch_get_main_queue(), ^{
        [weakSelf.cameraView setImage:image];
    });
}

RCT_EXPORT_METHOD(destroyDetector);
{
    [self.detector stop];
}

RCT_EXPORT_METHOD(createDetector);
{
    // ensure the detector has stopped
    [self destroyDetector];
    
    // iterate through the capture devices to find the front position camera
    NSArray *devices = [AVCaptureDevice devicesWithMediaType:AVMediaTypeVideo];
    for (AVCaptureDevice *device in devices)
    {
        if ([device position] == AVCaptureDevicePositionFront)
        {
            self.detector = [[AFDXDetector alloc] initWithDelegate:self
                                                usingCaptureDevice:device
                                                      maximumFaces:1];
            self.detector.maxProcessRate = 5;
            
            // turn on all classifiers (emotions, expressions, and emojis)
            [self.detector setDetectAllEmotions:YES];
            [self.detector setDetectAllExpressions:YES];
            [self.detector setDetectEmojis:YES];
            
            // turn on gender and glasses
            self.detector.gender = TRUE;
            self.detector.glasses = TRUE;
            
            // start the detector and check for failure
            NSError *error = [self.detector start];
            
            if (nil != error)
            {
                UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"Detector Error"
                                                                               message:[error localizedDescription]
                                                                        preferredStyle:UIAlertControllerStyleAlert];
                
                [self presentViewController:alert animated:YES completion:
                 ^{}
                 ];
                
                return;
            }
            
            break;
        }
    }
}

// This is the delegate method of the AFDXDetectorDelegate protocol. This method gets called for:
// - Every frame coming in from the camera. In this case, faces is nil
// - Every PROCESSED frame that the detector
RCT_EXPORT_METHOD(detector:(AFDXDetector *)detector hasResults:(NSMutableDictionary *)faces forImage:(UIImage *)image atTime:(NSTimeInterval)time);
{
    if (nil == faces)
    {
        [self unprocessedImageReady:detector image:image atTime:time];
    }
    else
    {
        [self processedImageReady:detector image:image faces:faces atTime:time];
    }
}

RCT_EXPORT_METHOD(viewWillAppear:(BOOL)animated);
{
    [super viewWillAppear:animated];
    [self createDetector]; // create the dector just before the view appears
}

RCT_EXPORT_METHOD(viewWillDisappear:(BOOL)animated);
{
    [super viewWillDisappear:animated];
    [self destroyDetector]; // destroy the detector before the view disappears
}

RCT_EXPORT_METHOD(didReceiveMemoryWarning);
{
    [super didReceiveMemoryWarning];
}

@end

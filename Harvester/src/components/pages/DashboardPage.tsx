import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { BaseCrudService } from '@/integrations';
import { AnalysisResults, ResultSuggestions } from '@/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Image } from '@/components/ui/image';
import {
  Upload,
  Camera,
  Power,
  Zap,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  BarChart3,
  RefreshCw,
  Play,
  Square,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function DashboardPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResults | null>(null);
  const [suggestions, setSuggestions] = useState<ResultSuggestions[]>([]);
  const [hardwareStatus, setHardwareStatus] = useState({
    conveyor: false,
    sorter: false,
    camera: false,
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadSuggestions();
    loadLatestAnalysis();
  }, []);

  const loadSuggestions = async () => {
    const { items } = await BaseCrudService.getAll<ResultSuggestions>('resultsuggestions');
    const sorted = items.sort((a, b) => (a.priorityOrder || 0) - (b.priorityOrder || 0));
    setSuggestions(sorted);
  };

  const loadLatestAnalysis = async () => {
    const { items } = await BaseCrudService.getAll<AnalysisResults>('analysisresults');
    if (items.length > 0) {
      const latest = items.sort((a, b) => {
        const dateA = new Date(a._createdDate || 0).getTime();
        const dateB = new Date(b._createdDate || 0).getTime();
        return dateB - dateA;
      })[0];
      setAnalysisResult(latest);
      if (latest.fruitImage) {
        setUploadedImage(latest.fruitImage);
      }
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        analyzeImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (imageData: string) => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(async () => {
      const newAnalysis: AnalysisResults = {
        _id: crypto.randomUUID(),
        analysisId: `ANALYSIS-${Date.now()}`,
        fruitImage: imageData,
        fruitType: ['Apple', 'Orange', 'Banana', 'Grape'][Math.floor(Math.random() * 4)],
        qualityAssessment: ['Excellent', 'Good', 'Fair', 'Poor'][Math.floor(Math.random() * 4)],
        confidenceScore: Math.floor(Math.random() * 20) + 80,
        analysisDate: new Date().toISOString(),
        isDefective: Math.random() > 0.7,
      };

      await BaseCrudService.create('analysisresults', newAnalysis);
      setAnalysisResult(newAnalysis);
      setIsAnalyzing(false);
    }, 2000);
  };

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsWebcamActive(true);
        setHardwareStatus(prev => ({ ...prev, camera: true }));
      }
    } catch (error) {
      console.error('Error accessing webcam:', error);
      alert('Unable to access webcam. Please check permissions.');
    }
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsWebcamActive(false);
      setHardwareStatus(prev => ({ ...prev, camera: false }));
    }
  };

  const captureWebcamImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/png');
        setUploadedImage(imageData);
        analyzeImage(imageData);
        stopWebcam();
      }
    }
  };

  const toggleHardware = (device: 'conveyor' | 'sorter' | 'camera') => {
    setHardwareStatus(prev => ({ ...prev, [device]: !prev[device] }));
  };

  const getQualityColor = (quality?: string) => {
    switch (quality?.toLowerCase()) {
      case 'excellent':
        return 'bg-primary text-primary-foreground';
      case 'good':
        return 'bg-primary/80 text-white';
      case 'fair':
        return 'bg-warning text-white';
      case 'poor':
        return 'bg-danger text-white';
      default:
        return 'bg-light-gray text-background';
    }
  };

  const getRelevantSuggestions = () => {
    if (!analysisResult) return suggestions.slice(0, 3);
    return suggestions.filter(
      s => s.qualityLevel === analysisResult.qualityAssessment ||
           s.applicableFruitType === analysisResult.fruitType
    ).slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <section className="py-16 px-8 flex-1">
        <div className="max-w-[120rem] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-heading font-bold text-white mb-12">
              Analysis Dashboard
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Upload & Webcam */}
              <div className="lg:col-span-2 space-y-8">
                {/* Image Upload Card */}
                <Card className="bg-[#1E293B] border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white font-heading flex items-center gap-2">
                      <Upload className="w-6 h-6 text-primary" />
                      Upload Fruit Image
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                        disabled={isAnalyzing}
                      >
                        <Upload className="w-5 h-5 mr-2" />
                        Select Image
                      </Button>

                      {uploadedImage && (
                        <div className="relative rounded-lg overflow-hidden border border-gray-800 group">
                          <Image
                            src={uploadedImage}
                            alt="Uploaded fruit"
                            width={800}
                            className="w-full h-96 object-cover transition-transform group-hover:scale-105"
                          />
                          {isAnalyzing && (
                            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                              <div className="text-center">
                                <RefreshCw className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                                <p className="text-white font-heading text-lg">Analyzing...</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Webcam Card */}
                <Card className="bg-[#1E293B] border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white font-heading flex items-center gap-2">
                      <Camera className="w-6 h-6 text-primary" />
                      Live Webcam Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        {!isWebcamActive ? (
                          <Button
                            onClick={startWebcam}
                            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            <Play className="w-5 h-5 mr-2" />
                            Start Webcam
                          </Button>
                        ) : (
                          <>
                            <Button
                              onClick={captureWebcamImage}
                              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                              <Camera className="w-5 h-5 mr-2" />
                              Capture & Analyze
                            </Button>
                            <Button
                              onClick={stopWebcam}
                              variant="outline"
                              className="border-danger text-danger hover:bg-danger hover:text-white"
                            >
                              <Square className="w-5 h-5 mr-2" />
                              Stop
                            </Button>
                          </>
                        )}
                      </div>

                      <div className="relative rounded-lg overflow-hidden border border-gray-800 bg-background">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="w-full h-96 object-cover"
                        />
                        {!isWebcamActive && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Camera className="w-24 h-24 text-gray-700" />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Hardware Control Card */}
                <Card className="bg-[#1E293B] border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white font-heading flex items-center gap-2">
                      <Zap className="w-6 h-6 text-primary" />
                      Hardware Control
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button
                        onClick={() => toggleHardware('conveyor')}
                        variant="outline"
                        className={`h-24 flex flex-col items-center justify-center gap-2 transition-all ${
                          hardwareStatus.conveyor
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'border-gray-700 text-light-gray hover:border-primary'
                        }`}
                      >
                        <Power className="w-8 h-8" />
                        <span className="font-heading">Conveyor</span>
                        <Badge className={hardwareStatus.conveyor ? 'bg-white text-primary' : 'bg-gray-700'}>
                          {hardwareStatus.conveyor ? 'ON' : 'OFF'}
                        </Badge>
                      </Button>

                      <Button
                        onClick={() => toggleHardware('sorter')}
                        variant="outline"
                        className={`h-24 flex flex-col items-center justify-center gap-2 transition-all ${
                          hardwareStatus.sorter
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'border-gray-700 text-light-gray hover:border-primary'
                        }`}
                      >
                        <TrendingUp className="w-8 h-8" />
                        <span className="font-heading">Sorter</span>
                        <Badge className={hardwareStatus.sorter ? 'bg-white text-primary' : 'bg-gray-700'}>
                          {hardwareStatus.sorter ? 'ON' : 'OFF'}
                        </Badge>
                      </Button>

                      <Button
                        onClick={() => toggleHardware('camera')}
                        variant="outline"
                        className={`h-24 flex flex-col items-center justify-center gap-2 transition-all ${
                          hardwareStatus.camera
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'border-gray-700 text-light-gray hover:border-primary'
                        }`}
                      >
                        <Camera className="w-8 h-8" />
                        <span className="font-heading">Camera</span>
                        <Badge className={hardwareStatus.camera ? 'bg-white text-primary' : 'bg-gray-700'}>
                          {hardwareStatus.camera ? 'ON' : 'OFF'}
                        </Badge>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Results & Suggestions */}
              <div className="space-y-8">
                {/* Prediction Results Card */}
                <Card className="bg-[#1E293B] border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white font-heading flex items-center gap-2">
                      <BarChart3 className="w-6 h-6 text-primary" />
                      Analysis Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analysisResult ? (
                      <div className="space-y-6">
                        <div>
                          <p className="text-sm font-paragraph text-light-gray mb-2">Fruit Type</p>
                          <p className="text-2xl font-heading font-bold text-white">
                            {analysisResult.fruitType}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-paragraph text-light-gray mb-2">Quality Assessment</p>
                          <Badge className={`${getQualityColor(analysisResult.qualityAssessment)} text-lg px-4 py-2`}>
                            {analysisResult.qualityAssessment}
                          </Badge>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <p className="text-sm font-paragraph text-light-gray">Confidence Score</p>
                            <p className="text-2xl font-heading font-bold text-primary">
                              {analysisResult.confidenceScore}%
                            </p>
                          </div>
                          <Progress value={analysisResult.confidenceScore} className="h-3" />
                        </div>

                        <div className="flex items-center gap-2 p-4 rounded-lg bg-background">
                          {analysisResult.isDefective ? (
                            <>
                              <AlertCircle className="w-6 h-6 text-danger" />
                              <span className="text-danger font-paragraph">Defect Detected</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-6 h-6 text-primary" />
                              <span className="text-primary font-paragraph">No Defects</span>
                            </>
                          )}
                        </div>

                        <div>
                          <p className="text-sm font-paragraph text-light-gray mb-1">Analysis ID</p>
                          <p className="text-xs font-mono text-light-gray/70">
                            {analysisResult.analysisId}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-paragraph text-light-gray mb-1">Analysis Date</p>
                          <p className="text-sm font-paragraph text-white">
                            {new Date(analysisResult.analysisDate || '').toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <BarChart3 className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                        <p className="text-light-gray font-paragraph">
                          Upload an image or use webcam to start analysis
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Suggestions Card */}
                <Card className="bg-[#1E293B] border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white font-heading flex items-center gap-2">
                      <TrendingUp className="w-6 h-6 text-primary" />
                      Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {getRelevantSuggestions().map((suggestion, index) => (
                        <motion.div
                          key={suggestion._id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className="p-4 bg-background rounded-lg border border-gray-800 hover:border-primary transition-all"
                        >
                          <h4 className="text-lg font-heading font-semibold text-white mb-2">
                            {suggestion.suggestionTitle}
                          </h4>
                          <p className="text-sm font-paragraph text-light-gray mb-3">
                            {suggestion.recommendationText}
                          </p>
                          {suggestion.actionUrl && (
                            <a
                              href={suggestion.actionUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary/80 text-sm font-paragraph inline-flex items-center gap-1"
                            >
                              Learn More <TrendingUp className="w-4 h-4" />
                            </a>
                          )}
                        </motion.div>
                      ))}
                      {getRelevantSuggestions().length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-light-gray font-paragraph">
                            No recommendations available yet
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

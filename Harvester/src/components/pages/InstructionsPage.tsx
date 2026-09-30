import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BaseCrudService } from '@/integrations';
import { UsageInstructions } from '@/entities';
import { Image } from '@/components/ui/image';
import { Upload, Camera, Shield, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function InstructionsPage() {
  const [instructions, setInstructions] = useState<UsageInstructions[]>([]);

  useEffect(() => {
    loadInstructions();
  }, []);

  const loadInstructions = async () => {
    const { items } = await BaseCrudService.getAll<UsageInstructions>('usageinstructions');
    setInstructions(items);
  };

  const defaultInstructions = [
    {
      category: 'Upload',
      icon: Upload,
      title: 'Image Upload Guidelines',
      summary: 'Best practices for uploading fruit images',
      content: 'Ensure images are well-lit, in focus, and show the fruit clearly. Supported formats: JPG, PNG, WebP. Maximum file size: 10MB. For best results, capture images against a neutral background with natural lighting.',
      tips: [
        'Use natural lighting when possible',
        'Ensure the fruit fills most of the frame',
        'Avoid shadows and reflections',
        'Keep the background simple and neutral',
      ],
    },
    {
      category: 'Webcam',
      icon: Camera,
      title: 'Live Webcam Usage',
      summary: 'How to use the real-time webcam feature',
      content: 'Position your webcam to capture the fruit clearly. Ensure adequate lighting and a stable camera position. The AI will analyze the feed in real-time and provide instant feedback on fruit quality.',
      tips: [
        'Position camera 12-18 inches from fruit',
        'Use consistent lighting conditions',
        'Keep the camera steady during analysis',
        'Allow 2-3 seconds for accurate detection',
      ],
    },
    {
      category: 'Safety',
      icon: Shield,
      title: 'Safety Protocols',
      summary: 'Important safety and handling guidelines',
      content: 'Always handle equipment with care. Ensure proper hygiene when handling fruit samples. Follow all local food safety regulations. Keep the analysis area clean and organized.',
      tips: [
        'Wash hands before handling fruit',
        'Clean equipment regularly',
        'Follow food safety guidelines',
        'Store fruit samples properly',
      ],
    },
  ];

  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('upload')) return Upload;
    if (cat.includes('webcam') || cat.includes('camera')) return Camera;
    if (cat.includes('safety') || cat.includes('security')) return Shield;
    return CheckCircle;
  };

  const instructionsToDisplay = instructions.length > 0 
    ? instructions.map(inst => ({
        category: inst.instructionCategory || 'General',
        icon: getCategoryIcon(inst.instructionCategory || ''),
        title: inst.instructionTitle || '',
        summary: inst.shortSummary || '',
        content: inst.detailedContent || '',
        visualAid: inst.visualAid,
        relatedLink: inst.relatedLink,
      }))
    : defaultInstructions;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="py-24 px-8 bg-[#1E293B]">
        <div className="max-w-[100rem] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl font-heading font-bold text-white mb-6">
              Usage Instructions
            </h1>
            <p className="text-xl font-paragraph text-light-gray max-w-3xl mx-auto">
              Complete guide to using the AI Fruit Analysis system effectively
            </p>
          </motion.div>
        </div>
      </section>

      {/* Instructions Grid */}
      <section className="py-16 px-8 bg-background">
        <div className="max-w-[100rem] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {instructionsToDisplay.map((instruction, index) => {
              const IconComponent = instruction.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-[#1E293B] rounded-xl p-8 border border-gray-800 hover:border-primary transition-all"
                >
                  <div className="bg-primary/10 p-4 rounded-lg inline-block mb-6">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <div className="mb-4">
                    <span className="text-primary font-paragraph text-sm font-semibold uppercase tracking-wider">
                      {instruction.category}
                    </span>
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-white mb-4">
                    {instruction.title}
                  </h3>
                  <p className="text-base font-paragraph text-light-gray mb-6 leading-relaxed">
                    {instruction.summary}
                  </p>
                  {instruction.visualAid && (
                    <div className="mb-6 rounded-lg overflow-hidden">
                      <Image
                        src={instruction.visualAid}
                        alt={instruction.title}
                        width={400}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}
                  <p className="text-sm font-paragraph text-light-gray leading-relaxed">
                    {instruction.content}
                  </p>
                  {instruction.relatedLink && (
                    <a
                      href={instruction.relatedLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center mt-6 text-primary hover:text-primary/80 transition-colors font-paragraph text-sm"
                    >
                      Learn More <ExternalLink className="ml-2 w-4 h-4" />
                    </a>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Detailed Tips Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#1E293B] rounded-xl p-12 border border-gray-800"
          >
            <h2 className="text-4xl font-heading font-bold text-white mb-8">
              Best Practices & Tips
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {defaultInstructions.map((instruction, index) => (
                <div key={index}>
                  <h4 className="text-xl font-heading font-semibold text-white mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    {instruction.category}
                  </h4>
                  <ul className="space-y-3">
                    {instruction.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="text-base font-paragraph text-light-gray flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Warning Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-8 bg-warning/10 border border-warning rounded-xl p-8"
          >
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-warning flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-2xl font-heading font-bold text-white mb-4">
                  Important Safety Notice
                </h3>
                <p className="text-base font-paragraph text-light-gray leading-relaxed">
                  This AI system is designed to assist with fruit quality analysis but should not replace professional judgment. Always follow proper food safety protocols and consult with qualified professionals for critical decisions. Ensure all equipment is properly maintained and calibrated for accurate results.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

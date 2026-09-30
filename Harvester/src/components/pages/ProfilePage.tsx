import { useMember } from '@/integrations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Calendar, Shield } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const { member } = useMember();

  const getInitials = () => {
    const firstName = member?.contact?.firstName || '';
    const lastName = member?.contact?.lastName || '';
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (member?.profile?.nickname) {
      return member.profile.nickname.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-primary text-primary-foreground';
      case 'PENDING':
        return 'bg-warning text-white';
      case 'BLOCKED':
        return 'bg-danger text-white';
      default:
        return 'bg-light-gray text-background';
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <section className="py-16 px-8 flex-1">
        <div className="max-w-[100rem] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-heading font-bold text-white mb-12">
              User Profile
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Card */}
              <Card className="bg-[#1E293B] border-gray-800 lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-white font-heading">Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <Avatar className="w-32 h-32 mb-6">
                    <AvatarImage src={member?.profile?.photo?.url} alt={member?.profile?.nickname || 'User'} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-heading">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl font-heading font-bold text-white mb-2">
                    {member?.profile?.nickname || 'User'}
                  </h2>
                  {member?.profile?.title && (
                    <p className="text-light-gray font-paragraph mb-4">{member.profile.title}</p>
                  )}
                  {member?.status && (
                    <Badge className={getStatusColor(member.status)}>
                      {member.status}
                    </Badge>
                  )}
                </CardContent>
              </Card>

              {/* Details Card */}
              <Card className="bg-[#1E293B] border-gray-800 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white font-heading">Account Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-background rounded-lg">
                    <User className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-paragraph text-light-gray mb-1">Full Name</p>
                      <p className="text-lg font-heading text-white">
                        {member?.contact?.firstName && member?.contact?.lastName
                          ? `${member.contact.firstName} ${member.contact.lastName}`
                          : member?.profile?.nickname || 'Not provided'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-background rounded-lg">
                    <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-paragraph text-light-gray mb-1">Email Address</p>
                      <p className="text-lg font-heading text-white">
                        {member?.loginEmail || 'Not provided'}
                      </p>
                      {member?.loginEmailVerified && (
                        <Badge className="bg-primary text-primary-foreground mt-2">Verified</Badge>
                      )}
                    </div>
                  </div>

                  {member?.contact?.phones && member.contact.phones.length > 0 && (
                    <div className="flex items-start gap-4 p-4 bg-background rounded-lg">
                      <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm font-paragraph text-light-gray mb-1">Phone Numbers</p>
                        {member.contact.phones.map((phone, index) => (
                          <p key={index} className="text-lg font-heading text-white">
                            {phone}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-4 p-4 bg-background rounded-lg">
                    <Calendar className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-paragraph text-light-gray mb-1">Member Since</p>
                      <p className="text-lg font-heading text-white">
                        {member?._createdDate
                          ? new Date(member._createdDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                          : 'Not available'}
                      </p>
                    </div>
                  </div>

                  {member?.lastLoginDate && (
                    <div className="flex items-start gap-4 p-4 bg-background rounded-lg">
                      <Calendar className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm font-paragraph text-light-gray mb-1">Last Login</p>
                        <p className="text-lg font-heading text-white">
                          {new Date(member.lastLoginDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

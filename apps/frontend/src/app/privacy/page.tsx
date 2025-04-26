import type { Metadata } from 'next';
import { Container } from "@/components/ui/container";
import { Text } from "@/components/ui/text";

export const metadata: Metadata = {
  title: '隐私政策',
  description: '我们如何收集、使用和保护您的个人信息',
};

export default function PrivacyPage() {
  return (
    <Container maxWidth="lg" center paddingX className="py-8">
      <Text variant="h1" className="mb-4">隐私政策</Text>
      <Text variant="body2" color="secondary" className="mb-8">最后更新日期: 2024年4月20日</Text>
      
      <div className="prose prose-sm sm:prose md:prose-lg dark:prose-invert max-w-none">
        <section className="mb-8">
          <Text variant="h2" className="mb-4">引言</Text>
          <Text variant="body1">
            我们非常重视您的隐私。本隐私政策描述了我们收集、使用、披露和保护您个人信息的方式。
            通过使用我们的网站和服务，您同意本隐私政策中描述的数据处理方式。
            我们承诺按照适用的数据保护法律保护您的个人信息。
          </Text>
        </section>

        <section className="mb-8">
          <Text variant="h2" className="mb-4">信息收集</Text>
          <Text variant="body1" className="mb-2">我们可能收集以下类型的信息：</Text>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>
              <strong>个人识别信息</strong>：包括您的姓名、电子邮件地址、电话号码、邮寄地址等。
            </li>
            <li>
              <strong>账户信息</strong>：包括您的用户名、密码和偏好设置。
            </li>
            <li>
              <strong>使用数据</strong>：关于您如何使用我们网站和服务的信息，包括访问时间、浏览页面、点击链接等。
            </li>
            <li>
              <strong>设备信息</strong>：包括您的IP地址、浏览器类型、操作系统和设备标识符。
            </li>
            <li>
              <strong>Cookie和类似技术</strong>：用于跟踪网站活动和保存某些用户首选项的小文件。
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <Text variant="h2" className="mb-4">信息使用</Text>
          <Text variant="body1" className="mb-2">我们使用收集的信息：</Text>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>提供、维护和改进我们的服务</li>
            <li>处理和完成交易</li>
            <li>发送与您账户和服务相关的通知</li>
            <li>响应您的请求和提供客户支持</li>
            <li>监控和分析使用趋势和活动</li>
            <li>保护我们的服务安全并防止欺诈</li>
            <li>遵守法律义务</li>
            <li>在获得您同意的情况下，发送营销和促销通信</li>
          </ul>
        </section>

        <section className="mb-8">
          <Text variant="h2" className="mb-4">信息共享与披露</Text>
          <Text variant="body1" className="mb-2">
            我们不会出售您的个人信息。然而，在以下情况下，我们可能会共享您的信息：
          </Text>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>
              <strong>服务提供商</strong>：我们可能与帮助我们运营业务和提供服务的第三方供应商和服务提供商共享信息。
            </li>
            <li>
              <strong>业务转让</strong>：如果我们参与合并、收购或资产出售，您的信息可能会作为交易的一部分被转让。
            </li>
            <li>
              <strong>法律要求</strong>：如果法律要求或为了保护我们的权利、财产或安全，我们可能会披露您的信息。
            </li>
            <li>
              <strong>征得同意</strong>：在您同意的情况下，我们可能会向第三方披露您的个人信息。
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <Text variant="h2" className="mb-4">数据安全</Text>
          <Text variant="body1">
            我们采取合理的技术和组织措施来保护您的个人信息，防止未经授权的访问、使用或披露。
            然而，请注意，尽管我们努力保护您的信息，但没有任何在线传输或电子存储方法是100%安全的。
            因此，虽然我们努力使用商业上可接受的方式保护您的个人信息，但我们不能保证其绝对安全性。
          </Text>
        </section>

        <section className="mb-8">
          <Text variant="h2" className="mb-4">Cookie政策</Text>
          <Text variant="body1" className="mb-2">
            我们使用Cookie和类似技术来收集和存储有关您如何使用我们网站的信息，并提供更个性化的体验。
            您可以通过浏览器设置管理Cookie首选项。请注意，禁用Cookie可能会影响我们网站的某些功能。
          </Text>
          <Text variant="body1">
            我们使用的Cookie类型包括：必要的Cookie、功能性Cookie、分析性Cookie和广告Cookie。
            每种类型的Cookie在我们网站上有不同的用途。
          </Text>
        </section>

        <section className="mb-8">
          <Text variant="h2" className="mb-4">您的权利</Text>
          <Text variant="body1" className="mb-2">
            根据适用的数据保护法律，您可能拥有以下权利：
          </Text>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>访问、更正和删除您的个人信息</li>
            <li>反对或限制我们处理您的个人信息</li>
            <li>数据可移植性</li>
            <li>撤回同意</li>
            <li>向数据保护机构投诉</li>
          </ul>
          <Text variant="body1" className="mt-2">
            要行使这些权利，请通过下方的联系信息与我们联系。我们将在合理的时间内响应您的请求。
          </Text>
        </section>

        <section className="mb-8">
          <Text variant="h2" className="mb-4">第三方链接</Text>
          <Text variant="body1">
            我们的网站可能包含指向第三方网站的链接。我们对这些网站的隐私做法或内容不负责任。
            我们建议您查看访问的任何第三方网站的隐私政策。
          </Text>
        </section>

        <section className="mb-8">
          <Text variant="h2" className="mb-4">儿童隐私</Text>
          <Text variant="body1">
            我们的服务不面向16岁以下的儿童。我们不会故意收集16岁以下儿童的个人信息。
            如果您发现我们可能收集了16岁以下儿童的个人信息，请立即联系我们，我们将采取步骤删除此类信息。
          </Text>
        </section>

        <section className="mb-8">
          <Text variant="h2" className="mb-4">隐私政策变更</Text>
          <Text variant="body1">
            我们可能会不时更新本隐私政策。如有重大变更，我们将在网站上发布通知或直接向您发送通知。
            我们鼓励您定期查看本政策，了解我们如何保护您的信息。
          </Text>
        </section>

        <section className="mb-8">
          <Text variant="h2" className="mb-4">联系我们</Text>
          <Text variant="body1" className="mb-2">
            如果您对本隐私政策有任何疑问或顾虑，请联系我们：
          </Text>
          <div className="mt-2">
            <Text variant="body1"><strong>电子邮件：</strong> privacy@example.com</Text>
            <Text variant="body1"><strong>地址：</strong> 某某省某某市某某区某某街道123号</Text>
            <Text variant="body1"><strong>电话：</strong> 123-456-7890</Text>
          </div>
        </section>
      </div>
    </Container>
  );
} 